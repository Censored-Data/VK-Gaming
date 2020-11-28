import React from 'react';
import ReactDOM from 'react-dom';
import { View, Panel, PanelHeader, Header, Group, Cell, List, Avatar, Tooltip, PanelHeaderButton, Footer, Search, Spinner } from '@vkontakte/vkui';

import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';

import '@vkontakte/vkui/dist/vkui.css';
import $ from 'jquery';
import './Teams.css'

	function getTopGames() {
    $.ajax({
    type: "GET",
    url: '/games/top',
    headers: {
        'limit'  : 50,
        'offset' : 0,
    }}).done(function(response) {
        $('#ss_gamecard_content').html('');
        response.forEach(function(item, i, arr) {
        	var gameCard = '<div id="ss_game_card" class="Card Card--ios Card--sz-l Card--md-tint" style="margin-bottom: 15px;"> <div class="Card__in"> <div class="Cell Cell--ios Cell--expandable Cell--m ss_game_content"> <div disabled="" role="button" class="Tappable Tappable--ios Cell__in Tappable--inactive"> <div class="Cell__before"> <div class="Cell__before-in"> <div class="Avatar Avatar--ios Avatar--type-default Avatar--sz-48"> <div class="Avatar__in" style="width: 48px; height: 48px"><img class="Avatar__img" src="' + item['logo']['large'] + ' /><span class="Avatar__shadow"></span></div> </div> </div> </div> <div class="Cell__main"> <div class="Cell__children">' + item['title'] + '</div> <div class="Cell__description"> Steam </div> </div> <div class="Cell__indicator"></div> <div class="Cell__aside"> <div class="Icon Icon--24 Icon--w-16 Icon--h-24 Icon--chevron_24 Cell__chevron" style="width: 16px; height: 24px"> </div> </div> </div> </div> </div>'
            $('#ss_gamecard_content').append(gameCard);
        });
    }).fail(function(err) {

    });

    $("body").on("click",".gameCardMini", function(){
        //this.setState({ activePanel: 'games' })
    });
}

class Teams extends React.Component {

componentDidMount() {
	getTopGames();
}

render() {
return (
<>
<PanelHeader left={<Tooltip  alignX="left" isShown={false} cornerOffset={-10} offsetX={7} text="Вы можете создать собственную команду, чтобы участвовать в турнирах с другими игроками"><PanelHeaderButton><Icon28ListOutline /></PanelHeaderButton></Tooltip>} > Сообщества </PanelHeader>

<Header mode="secondary" separator={false}> Умный подбор </Header>
<div className="smart_search_container" id="ss_card">
<img src="https://cdn.game.tv/game-tv-content/images_3/b7f56ea1567592a3d3ed377ccabc25ac/b7f56ea1567592a3d3ed377ccabc25ac/1.jpg" className="ss_image" alt="smart_search" />
<div className="ss_sub">
<img src="https://www.meme-arsenal.com/memes/e36050badd32a3b3fbcca2bc5cebadc3.jpg" className="ss_avatar" />
<h2 className="Headline Headline--w-semibold" id="ss_title"> Counter-Strike: Global Offensive </h2>
</div>
</div>

<div className="random_search">
<Search  className="ss_search" />
<div id="ss_gamecard_content">
<Spinner size="medium" style={{ marginTop: 20 }} />
</div>
<Footer> </Footer>
</div>
</>
) } }

export default Teams;