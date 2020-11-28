import React, { Component } from 'react';
import { PanelHeader, Group, PanelHeaderButton, Footer, Title, Button, PullToRefresh, TabbarItem, HorizontalScroll, FixedLayout } from '@vkontakte/vkui';

import bridge from '@vkontakte/vk-bridge';

import Icon28SearchOutline from '@vkontakte/icons/dist/28/search_outline';

import '@vkontakte/vkui/dist/vkui.css';
import $ from 'jquery';
import './Streams.css';

import { Splide, SplideSlide } from '@splidejs/react-splide';
import '../../css/slider.css';

function getTopGames() {
$.ajax({
    type: "GET",
    url: '/games/top',
    headers: {
        'limit'   : 10,
        'offset'  : 0,
        'referer' : window.location.href,
    }}).done(function(response) {
        console.log(window.location.href);
        $('.tg_main_scroll').html('');
        response.forEach(function(item, i, arr) {
            var gameCard = '<div class="tg_mini_block"> <div class="tg_image_container"> <img src="' + item['logo']['large'] + '" class="tg_image" /> </div> <h2 class="Title Title--w-heavy Title--l-2 tg_title"> ' + item['title'] + ' </h2> <div class="Text Text--w-regular tg_sub_title"> ' + item['viewers'] + ' зрителей</div> </div>';
            $('.tg_main_scroll').append(gameCard);
        });
    }).fail(function(err) {

    });
 }

 function getTopStreams() {
$.ajax({
    type: "GET",
    url: '/streams/top',
    headers: {
        'limit'   : 10,
        'referer' : window.location.href,
    }}).done(function(response) {
        console.log(response);
        $('.ts_main_container').html('');
        response.forEach(function(item, i, arr) {
            $('.ts_main_scroll').append(item['iframe']);
        });
    }).fail(function(err) {

    });
 }

class Streams extends Component {

constructor (props) {
    super(props);
    this.state = {
      fetching: false
    }
  

    this.onRefresh = () => {
      this.setState({ fetching: true });
      getTopGames();
      getTopStreams();
      setTimeout(() => {
        this.setState({
          fetching: false
        });
      });
    }
  }

componentDidMount() {
getTopGames();
getTopStreams();
}


render() {
return (
<>
<PanelHeader id="stream__panel" left={<PanelHeaderButton><Icon28SearchOutline /></PanelHeaderButton>} separator={false}> Трансляции </PanelHeader>

<PullToRefresh onRefresh={this.onRefresh} isFetching={this.state.fetching}>

<Splide options={ { type : 'loop', autoplay: true, cover : true, arrows : false, width : '100%', gap : '1rem', height  : '12rem', focus  : 'center', lazyLoad: 'nearby', padding: { right: '2rem', left : '2rem', } } }>

<li class="splide__slide">

<div class="splide__slide__container">
<img src="https://gamemag.ru/images/cache/News/News150764/7592b29335-2_1390x600.jpg" />
</div>
<h2 className="Title Title--w-heavy Title--l-2 splide__slide__title"> Играем в Spider Man - Miles Morales </h2>
</li>

<li class="splide__slide">
<div class="splide__slide__container">
<img src="https://compass-ssl.xbox.com/assets/a7/74/a77438db-e4f8-4d30-92b4-5b26f246219f.jpg?n=Minecraft_Sneaky-Slider-1084_Aquatic_1600x675.jpg" />
</div>
<h2 className="Title Title--w-heavy Title--l-2 splide__slide__title"> Minecraft </h2>
</li>

<li class="splide__slide">
<div class="splide__slide__container">
<img src="https://sm.ign.com/t/ign_ru/screenshot/default/cod1_dsfa.600.jpg" />
</div>
<h2 className="Title Title--w-heavy Title--l-2 splide__slide__title"> Call of Duty: Cold War </h2>
</li>

<li class="splide__slide">
<div class="splide__slide__container">
<img src="https://kuban24.tv/wp-content/uploads/2020/05/Screenshot_1-13.jpg" />
</div>
<h2 className="Title Title--w-heavy Title--l-2 splide__slide__title"> Grand Theft Auto V </h2>
</li>

</Splide>
<div className="streams__content">
<Group id="topgames__container" separator={false} header={<Title level="2" weight="heavy" id="sc_title" separator={false}> Популярные игры </Title>}>
<div className="tg_main_container">
<div className="tg_main_scroll">

<div className="tg_mini_block">
<div className="tg_image_container"> </div>
</div>

<div className="tg_mini_block">
<div className="tg_image_container"> </div>
</div>

<div className="tg_mini_block">
<div className="tg_image_container"></div>
</div>

</div>
</div>
<div className="tg_button_container">
<Button size="xl" mode="secondary"  onClick={ () => this.setState({ activeView: 'games' }) }> Смотреть все игры </Button>
</div>
</Group>

</div>

<Group id="topstreams__container" separator={false} header={<Title level="2" weight="heavy" id="sc_title" style={{marginTop:20}} separator={false}> Популярные трансляции </Title>}>
<div className="ts_main_container">

</div>
</Group>

<Footer> </Footer>
</PullToRefresh>
</>
) } }

export default Streams;