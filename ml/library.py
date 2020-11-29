def config():
    import pandas as pd
    from sklearn.neighbors import NearestNeighbors
    import pickle
    import json
    new_data = pd.read_csv('new_data.csv', index_col=0)
    model = pickle.load(open('model.sav', 'rb'))
    cl_model = pickle.load(open('cl_model.sav', 'rb'))
    knn = pickle.load(open('knn.sav', 'rb'))
    cs_data = pd.read_csv('cs.csv', index_col=0)
    import requests


def get_recomendation_games(user_id):
    import pandas as pd
    import pickle
    new_data = pd.read_csv('new_data.csv', index_col=0)
    model = pickle.load(open('model.sav', 'rb'))

    user_res = new_parse(user_id)
    user_col = user_res.columns
    c = new_data.columns
    cols = list(set(user_col) & set(c))
    zeros = list(set(c) - set(user_col))
    user_res[zeros] = 0
    user_res = user_res[c]
    res = model.kneighbors(user_res, 5)[1][0]
    recomendations = new_data.iloc[res][zeros].sum(axis=0).sort_values().tail(10)

    return pd.DataFrame((pd.DataFrame(recomendations).index)).to_json()

def get_recomendation_users(user_id):
    import pandas as pd
    import pickle
    new_data = pd.read_csv('new_data.csv', index_col=0)
    model = pickle.load(open('model.sav', 'rb'))
    user_res = new_parse(user_id)
    user_col = user_res.columns
    c = new_data.columns
    cols = list(set(user_col) & set(c))
    zeros = list(set(c) - set(user_col))
    user_res[zeros] = 0
    user_res = user_res[c]
    res = model.kneighbors(user_res)[1][0]

    return pd.DataFrame(new_data.iloc[res].index[1:]).to_json()




def parse(response, data, user_id):
    data = data.append({'id': 0}, ignore_index=True)
    data['id'][-1:] = str(user_id)
    r = json.loads(response)
    for i in range(r['response']['game_count']):

        game_data = r['response']['games'][i]
        if game_data['appid'] not in data.columns:
            data[game_data['appid']] = 0
        data[game_data['appid']][-1:] = game_data['playtime_forever']
    return data


def new_parse(user_id):
    import json
    import pandas as pd
    res = get_user_data(user_id)
    data = pd.DataFrame({'id': 0}, index=[0])
    r = json.loads(res)
    for i in range(r['response']['game_count']):
        game_data = r['response']['games'][i]
        if game_data['appid'] not in data.columns:
            data[game_data['appid']] = 0
        data[game_data['appid']][-1:] = game_data['playtime_forever']
    data['id'][-1:] = user_id
    return data.set_index('id', drop=True)


def get_user_data(userid):
    import requests
    url = "http://peace-data-team.ru:4001/user/games/steam"

    payload={}
    headers = {
      'steam_id': str(userid)
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    return response.text



def get_user_csgo_data(userid):
    import requests
    url = "http://peace-data-team.ru:4001/user/stats/csgo"

    payload={}
    headers = {
      'steam_id': str(userid)
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    return response.text


cols = ['total_kills', 'total_deaths', 'total_time_played','total_planted_bombs', 'KD']



def get_cs_team(user_id):
    import pandas as pd
    import pickle
    import json

    cl_model = pickle.load(open('cl_model.sav', 'rb'))
    knn = pickle.load(open('knn.sav', 'rb'))
    cs_data = pd.read_csv('cs.csv', index_col=0)
    user_data = pd.DataFrame({'0': 0}, index=[0])
    res = json.loads(get_user_csgo_data(user_id))
    for j in res['playerstats']['stats']:
        user_data[j['name']] = j['value']
    user_data['KD'] = user_data['total_kills']/user_data['total_deaths']
    try:
        user_data = user_data[cols]
    except Exception:
        missed = list(set(cols) - set(user_data.columns))
        user_data[missed] = 0
        user_data = user_data[cols]
        for col in user_data.columns:
            user_data[user_data[col].isnull()] = 0
        user_data['cluster'] = cl_model.predict(user_data)[0]
        res = knn.kneighbors(user_data)[1][0][1:]
    return  pd.DataFrame(cs_data.iloc[res].iloc[1:].reset_index()).to_json()

