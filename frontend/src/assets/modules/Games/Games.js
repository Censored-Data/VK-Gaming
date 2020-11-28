import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import { View, Panel, PanelHeader, Header, Group, Cell,  CardGrid, Card, Gradient, CardScroll, Link, Footer, Search, PanelHeaderButton, Spinner, PullToRefresh} from '@vkontakte/vkui';

import Icon28SlidersOutline from '@vkontakte/icons/dist/28/sliders_outline';

import $ from 'jquery';
import './Games.css';

function getTopGames() {
    $.ajax({
    type: "GET",
    url: '/games/top',
    headers: {
        'limit'  : 50,
        'offset' : 0,
    }}).done(function(response) {
        $('.gameCardsBlock').html('');
        response.forEach(function(item, i, arr) {
            var gameCard = '<div class="gameCardMini"> <img src="' + item['logo']['large'] + '" class="gameCardMini__image" /> <h2 class="Title Title--w-heavy Title--l-2 gameCard__Title"> ' + item['title'] + ' </h2> <div className="Text Text--w-regular" gameCard__subTitle> ' + item['viewers'] + ' зрителей</div> </div>';
            $('.gameCardsBlock').append(gameCard);
        });
    }).fail(function(err) {

    });

    $("body").on("click",".gameCardMini", function(){
        //this.setState({ activePanel: 'games' })
    });
}

class Games extends React.Component {

constructor(props) {
    super(props);
    this.state = {
      activePanel: 'games',
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
    getTopGames();
}

render() {
    return (
    	<>
        <PanelHeader left={<PanelHeaderButton><Icon28SlidersOutline /></PanelHeaderButton>} separator={false}> Игры </PanelHeader>
    	<Search  />
        <PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>
    	<div className="gameCardsBlock">
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Spinner size="medium" style={{ marginTop: 20 }} />
    	</div>
        </div>
    	<Footer> </Footer>
        </PullToRefresh>
    	</>
    );
  }
}

export default Games;