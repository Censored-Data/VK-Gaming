import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import md5 from 'crypto-js/md5';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { PanelHeader, Header, Group, Cell, PanelHeaderButton, Footer, Card, Title, Switch, Separator, CardGrid, Text, Button, Spinner, RichCell, HorizontalScroll, Avatar, PullToRefresh } from '@vkontakte/vkui';

import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';

import $ from 'jquery';
import './Profile.css';

bridge.send("VKWebAppInit", {});

function exportToStory() {

  var node = document.getElementById('statsTable');

  htmlToImage.toPng(node)
  .then(function (dataUrl) {
    var img = new Image();
    img.src = dataUrl;
    document.body.appendChild(img);
  })
  .catch(function (error) {
    console.error('oops, something went wrong!', error);
  });

  bridge.send("VKWebAppShowStoryBox", { "background_type" : "image", "url" : "https://sun9-65.userapi.com/c850136/v850136098/1b77eb/0YK6suXkY24.jpg" });
}

class Profile extends React.Component {

constructor (props) {
    super(props);
    this.state = {
      fetching: false
    }
  
    this.onRefresh = () => {
      this.setState({ fetching: true });
      //getTopGames();
      setTimeout(() => {
        this.setState({
          fetching: false
        });
      });
    }
  }

componentDidMount() {

bridge
   .send("VKWebAppStorageGet", {"keys": ["profile"]})
   .then(result => {

    var userData   = JSON.parse(result['keys'][0]['value']);
    var domain = window.location.hostname;

    $('#steam_auth_btn').attr('href', 'http://' + domain + ':4001' + '/steam/auth/?vk_user_id=' + userData['id']);
    $('.profile__image').attr('src', userData['photo_100']);
    $('#profile__username').html(userData['first_name'] + ' ' + userData['last_name']);
    $('#profile__url').html('vk.com/id' + userData['id']);
    
    const url = new URLSearchParams(window.location.search);
    const ts = url.get('vk_ts');

    function get_csgo_data(steam_id) {
        $.ajax({
            type: "GET",
            url: '/user/stats/csgo',
            headers: {
                'steam_id': steam_id,
            }
        }).done(function(response) {
            $('.statsTable').html('');
            var total_kills  = parseInt(response['playerstats']['stats'][0]['value']);
            var total_deaths = parseInt(response['playerstats']['stats'][1]['value']);
            var total_time_played = parseInt(response['playerstats']['stats'][2]['value']) / 60;
            var total_money_earned = parseInt(response['playerstats']['stats'][7]['value']);
            var total_damage_done = parseInt(response['playerstats']['stats'][6]['value']);
            var TOTAL_WINS = parseInt(response['playerstats']['stats'][5]['value']);
            var KD = parseInt(total_kills / total_deaths * 100 * 100) / 100 + '%';

            $('.statsTable').append('<div class="st_item_block"> <span class="sti_title"> K/D </span> <span class="sti_value" id="st_kd"> ' + KD + ' </span> </div>');
            $('.statsTable').append('<div class="st_item_block"> <span class="sti_title"> Всего побед </span> <span class="sti_value" id="st_kd"> ' + TOTAL_WINS + ' </span> </div>');
            $('.statsTable').append('<div class="st_item_block"> <span class="sti_title"> Всего убийств </span> <span class="sti_value" id="st_kd"> ' + total_kills + ' </span> </div>');
            $('.statsTable').append('<div class="st_item_block"> <span class="sti_title"> Всего смертей </span> <span class="sti_value" id="st_kd"> ' + total_deaths + ' </span> </div>');
            $('.statsTable').append('<div class="st_item_block"> <span class="sti_title"> Денег заработано </span> <span class="sti_value" id="st_kd"> ' + total_money_earned + '$' + ' </span> </div>');
            $('.statsTable').append('<div class="st_item_block"> <span class="sti_title"> Нанесено урона </span> <span class="sti_value" id="st_kd"> ' + total_damage_done + ' </span> </div>');

            $('.shareBtn').show();
        }).fail(function(err) {
            alert('FAIL');
        });

    }
    $.ajax({
            type: "GET",
            url: '/services/connected',
            headers: {
                'hash': md5(ts + userData['id']).toString(),
                'referer': window.location.href,
            }
        }).done(function(user) {
                console.log(user);
                if (user['steam_data'] !== null && user['steam_id'] !== null) {
                    $('#servicesList').html(' <div role="button" class="Tappable RichCell Tappable--inactive"><div className="Avatar--type-default Avatar--sz-48"><div class="Avatar__in" style="width: 48px; height: 48px;"><div class="Avatar__img" style="border-radius: 50%;"> <img class="Avatar__img" src="' + user['steam_data']['avatar']['medium'] + '" style="border-radius: 50%;"> </div><span class="Avatar__shadow" style="border-radius: 50%;"></span></div></div><div class="RichCell__in" style="margin-left:15px;"><div class="RichCell__top"><span>- 700 ₽</span><div class="RichCell__content"><div class="RichCell__children"> ' + user['steam_data']['username'] + ' </div><div class="RichCell__after"><div class="Icon Icon--24 Icon--w-16 Icon--h-24 Icon--chevron_24 Cell__chevron" style="width: 16px; height: 24px;"><svg viewBox="0 0 16 24" width="16" height="24" style="display: block;"><use xlink:href="#chevron_24" style="fill: currentcolor;"></use></svg></div></div></div><div class="RichCell__caption"> Steam аккаунт </div></div></div></div>')
                    get_csgo_data(user['steam_id']);
      } else {
        $('#servicesList').html('<a style="margin-top:10px; margin-bottom:10px;" id="steam_auth_btn" href="http://peace-data-team.ru:4001/steam/auth/?vk_user_id=' + userData['id'] + '" role="button" class="Tappable Tappable--ios Button Button--ios Button--sz-l Button--lvl-secondary Button--aln-center Button--str Tappable--inactive"><div class="Button__in"><div class="Button__content"> Подключить Steam аккаунт </div></div></a>');
      }
    }).fail(function(err) {
      alert('FAIL');
    });
   })
}

render() {
    return (
      <>
      <PanelHeader left={<PanelHeaderButton><Icon28Notifications /></PanelHeaderButton>} separator={false}>Профиль</PanelHeader>
      
      <HorizontalScroll>
      <div className="top__scroll">
      <span className="topBtn topBtn__active"> Аккаунт </span>
      <span className="topBtn"> Платформы </span>
      <span className="topBtn"> Статистика </span>
      </div>
      </HorizontalScroll>
     
      <PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
      <Group separator="hide">
      <CardGrid>
      <Card size="l">
      <div className="profile__cardblock">
      <img className="profile__image" alt="Аватар" />
      <div className="profile__sideinfo">
      <Title level="2" weight="heavy" id="profile__username"></Title>
      <Text weight="regular" id="profile__url"></Text>
      </div>
      </div>
      </Card>
      
      <Card size="l" id="settingsCard">
      <Group header={<Header mode="secondary"> Подключенные платформы </Header>}>
      <div id="servicesList">
      <Spinner size="medium" style={{ marginTop: 20, marginBottom: 20 }} />
      </div>
      </Group>
      </Card>

      <Card size="l" id="settingsCard">
      <Group header={<Header mode="secondary" separator={true}> Статистика CS:GO </Header>}>
      <div className="statsTable" id="statsTable">
      <Spinner size="medium" style={{ marginTop: 20, marginBottom: 20 }} />
      </div>
      <span className="shareBtn" onClick={ () => {exportToStory()}}> Поделиться в истории </span>
      </Group>
      </Card>

      <Card size="l" id="settingsCard">
      <Group header={<Header mode="secondary"> О приложении </Header>}>
      <Cell id="settings__item" expandable onClick={function(e) { bridge.send("VKWebAppShare", {"link": "https://m.vk.com/app7667001"})}}> Рассказать друзьям </Cell>
      <Separator />
      <Cell id="settings__item" expandable onClick={() => bridge.send("VKWebAppAddToFavorites")}> Добавить в избранное </Cell>
      </Group>
      </Card>
      </CardGrid>
      <Footer> Версия 1.0.0 </Footer>
      </Group>
      </PullToRefresh>
      </>
    )
   }
  }

export default Profile;