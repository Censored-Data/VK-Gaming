const userAgents  =   require('random-useragent');
const rateLimit   =   require('express-rate-limit');
const request     =   require('request');
const mysql       =   require('mysql2');
const crypto      =   require('crypto');
const qs          =   require('querystring');
var SteamAuth     =   require('node-steam-openid');
var app           =   require('express')();
var md5           =   require('md5');
var fs            =   require('fs');
var https         =   require('https');
var port          =   process.env.PORT || 4001;


const FRONTEND_PORT     =  4000;
const BACKEND_PORT      =  4001;
const DOMAIN            =  "YOUR_DOMAIN"; 
const VK_SECRET_KEY     =  "YOUR_VK_SECRET_KEY";
const TWITCH_CLIENT_ID  =  "YOUR_TWITCH_CLIENT_ID";
const STEAM_API_KEY     =  "YOUR_STEAM_API_KEY";

httpsOptions = {
    key  : fs.readFileSync("./../certificates/privkey.pem"), 
    cert : fs.readFileSync("./../certificates/cert.pem")
}

app.use(function(req, res, next){
   var data = "";
   req.on('data', function(chunk){ data += chunk})
   req.on('end', function(){
      req.rawBody = data;
      next();
   })
})

const limiter = rateLimit({
  windowMs: 1000,
  max: 3,
  message: JSON.stringify({"status" : "error","message": "Вы слишком часто пользуйтесь нашими услугами"})
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const connection = mysql.createConnection({
    host             :  "YOUR_SERVER",
    user             :  "YOUR_USER",
    password         :  "YOUR_PASSWORD",
    database         :  "YOUR_DB_NAME"
});

const statusCode = {
    "success"        :  200,
    "flud"           :  429,
    "bad_request"    :  400,
    "unauthorized"   :  401,
    "payment"        :  402,
    "forbidden"      :  403
}


// +-----------------------------------+
// | User digital signature validation |
// +-----------------------------------+

async function signRequest(url, hash) {

  const urlParams  = qs.parse(url);
  const vk_user_id = urlParams.vk_user_id;
  const vk_ts      = urlParams.vk_ts;
  const ordered    = {};
  const gen_hash   = crypto.createHash('md5').update(vk_ts + vk_user_id).digest("hex");

  Object.keys(urlParams).sort().forEach(function(item, i, arr) {
    if (item.slice(0, 3) === 'vk_') {
      ordered[item] = urlParams[item];
  }});
  
  const stringParams = qs.stringify(ordered);
  const paramsHash = crypto
    .createHmac('sha256', VK_SECRET_KEY)
    .update(stringParams)
    .digest()
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=$/, '');

    console.log(paramsHash === urlParams.sign);

  console.log(hash + '  ' + gen_hash);
  
  return new Promise(async function(resolve) {
  if (hash == gen_hash) {
  connection.query("SELECT * FROM users WHERE users.vk_id = '" + vk_user_id + "'", async function(err, results, fields) {
  if (err) throw err;
  if (results.length > 0) {

    var steam_id   = null;
    var steam_data = null;

    if (results[0]['steam_id'] !== '' && results[0]['steam_data'] !== '') {
      steam_id = results[0]['steam_id'];
      var steamContent = JSON.parse(results[0]['steam_data']);
      var steam_data   = {
        'steam_id'    : steamContent['steamid'],
        'username'    : steamContent['username'],
        'realname'    : steamContent['name'],
        'profile_url' : steamContent['profile'],
        'avatar'      : {
          'small'     : steamContent['avatar']['small'],
          'medium'    : steamContent['avatar']['medium'],
          'large'     : steamContent['avatar']['large'],
        }
      } 
    } 
    var userInfo = {
      'user_id'    : results[0]['u_id'],
      'vk_user_id' : results[0]['vk_id'],
      'steam_id'   : steam_id,
      'steam_data' : steam_data
    }
    console.log(userInfo);
  	return resolve([true, userInfo]);
  } else {
  connection.query("INSERT INTO `users` (`u_id`, `vk_id`, `steam_id`, `steam_data`, `current_game`) VALUES (NULL, '" + vk_user_id + "', '', '', '')", async function(err, results, fields) {
  if (err) { console.log(err); } else {
  	return resolve(await signRequest(url, hash));
  }})}})
  } else {
    console.log('Несостыковка хэшей');
    return resolve([false, null]);
  } }) }

// +----------------------------+
// | Generating a random string |
// +----------------------------+

function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// +------------------------------------------+
// | Display of popular games based on Twitch |
// +------------------------------------------+

app.get('/games/top', async (req, res) => {

    res.type('json');

    var limit    =  req.headers['limit'];
    var offset   =  req.headers['offset'];
    var referer  =  req.headers['referer'];
    var hash     =  req.headers['hash'];

    var options = {
        'method'  : 'GET',
        'url'     : 'https://api.twitch.tv/kraken/games/top?limit=' + limit + '&offset=' + offset,
        'headers' : {
            'client-id'  : TWITCH_CLIENT_ID,
            'accept'     : 'application/vnd.twitchtv.v5+json',
            'user-agent' : userAgents.getRandom()['userAgent']
        }
    }

    request(options, async function(error, response) {
    if (!error) {
      var return_data = [];

      JSON.parse(response.body)['top'].forEach(function(item, i, arr) {
        var gameItem = {
            'title'    : item['game']['name'],
            'viewers'  : item['viewers'],
            'channels' : item['channels'],
            'logo'     : {
              'large'  : item['game']['box']['large'],
              'medium' : item['game']['box']['medium'],
              'small'  : item['game']['box']['small'],
            } }
            return_data.push(gameItem);
      });
      res.send(return_data);

    } else {
    if (error['code'] == 'ECONNRESET') { return { "statusCode": statusCode['bad_request'], "Error": "Error when using proxy, possibly incorrect proxy format" }, statusCode['unauthorized'];
    } else { console.log(error); } }
    
    }); });


// +------------------------------------------------+
// | Displaying a list of popular Twitch broadcasts |
// +------------------------------------------------+

app.get('/streams/top', async (req, res) => {

    res.type('json');

    var limit    =  req.headers['limit'];

    var options = {
        'method'  : 'GET',
        'url'     : 'https://api.twitch.tv/kraken/clips/top?channel=Twitch&period=month&trending=true&limit=' + limit,
        'headers' : {
            'client-id'  : TWITCH_CLIENT_ID,
            'accept'     : 'application/vnd.twitchtv.v5+json',
            'user-agent' : userAgents.getRandom()['userAgent']
        }
    }

    request(options, async function(error, response) {
    if (!error) {
      var return_data = [];

      JSON.parse(response.body)['clips'].forEach(function(item, i, arr) {
        var gameItem = {
            'iframe'   : item['embed_html']
           }
            return_data.push(gameItem);
      });
      res.send(return_data);

    } else {
    if (error['code'] == 'ECONNRESET') { return { "statusCode": statusCode['bad_request'], "Error": "Error when using proxy, possibly incorrect proxy format" }, statusCode['unauthorized'];
    } else { console.log(error); } }
    
    }); });



// +------------------------------------+
// | Displaying user-connected services |
// +------------------------------------+

app.get("/services/connected", async (req, res) => {
  var referer  =  req.headers['referer'];
  var hash     =  req.headers['hash'];
  var request  =  await signRequest(referer, hash);
  console.log(request[1]);
  if (request[0] == true) {
    res.send(request[1]);
  }
});

// +-----------------------------------------------+
// | User redirect to the Steam authorization page |
// +-----------------------------------------------+


app.get("/steam/auth", async (req, res) => {
  var steamSettings = {
  	realm     : "http://" + DOMAIN + ":" + BACKEND_PORT,
   	returnUrl : "http://" + DOMAIN + ":" + BACKEND_PORT + "/steam/auth/authenticate",
   	apiKey    :  STEAM_API_KEY 	
  }
  steamSettings['returnUrl'] += '/?vk_user_id=' + req.query.vk_user_id;
  const steam = new SteamAuth(steamSettings);
  const redirectUrl = await steam.getRedirectUrl();
  return res.redirect(redirectUrl);
});

// +----------------------------------------------------------+
// | Redirect to the page after successful user authorization |
// +----------------------------------------------------------+
 
app.get("/steam/auth/authenticate", async (req, res) => {
  var steamSettings = {
  	realm     : "http://" + DOMAIN + ":" + BACKEND_PORT,
   	returnUrl : "http://" + DOMAIN + ":" + BACKEND_PORT + "/steam/auth/authenticate/?vk_user_id=" + req.query.vk_user_id,
   	apiKey    :  STEAM_API_KEY 	
  }

  console.log(steamSettings);
  const steam = new SteamAuth(steamSettings);
  try {
    const user = await steam.authenticate(req);

    connection.query("UPDATE `users` SET `steam_id` = '" + user['steamid'] + "', `steam_data` = '" + JSON.stringify(user) + "' WHERE `users`.`vk_id` = " + req.query.vk_user_id, async function(err, results, fields) {
    if (err) { console.log(err); } else {
    return res.redirect('https://vk.com/app7667001');
    }})} catch (error) {
    console.error(error);
  }
});



app.get('/user/games/steam', async (req, res) => {

    res.type('json');

    var steam_id    =  req.headers['steam_id'];

    var options = {
        'method'  : 'GET',
        'url'     : 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + STEAM_API_KEY + '&steamid=' + steam_id + '&format=json',
        'headers' : {
            'client-id'  : TWITCH_CLIENT_ID,
            'accept'     : '*/*',
            'user-agent' : userAgents.getRandom()['userAgent']
        }
    }

    request(options, async function(error, response) {
    if (!error) {
      res.send(response.body);
    } else {
    if (error['code'] == 'ECONNRESET') { return { "statusCode": statusCode['bad_request'], "Error": "Error when using proxy, possibly incorrect proxy format" }, statusCode['unauthorized'];
    } else { console.log(error); } }
    
    }); });



app.get('/user/stats/csgo', async (req, res) => {

    res.type('json');

    var steam_id    =  req.headers['steam_id'];

    var options = {
        'method'  : 'GET',
        'url'     : 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=' + STEAM_API_KEY + '&steamid=' + steam_id + '&format=json',
        'headers' : {
            'client-id'  : TWITCH_CLIENT_ID,
            'accept'     : '*/*',
            'user-agent' : userAgents.getRandom()['userAgent']
        }
    }

    request(options, async function(error, response) {
    if (!error) {
      res.send(response.body);
    } else {
    if (error['code'] == 'ECONNRESET') { return { "statusCode": statusCode['bad_request'], "Error": "Error when using proxy, possibly incorrect proxy format" }, statusCode['unauthorized'];
    } else { console.log(error); } }
    
    }); });

app.listen(port, async function(){
  console.log('VK API server started at port: ' + port);
});