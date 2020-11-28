import React, { Component } from 'react';

import { View, Epic, Tabbar, TabbarItem, Panel, Root} from '@vkontakte/vkui';

import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28UserOutline from '@vkontakte/icons/dist/28/user_outline';
import Icon28GameOutline from '@vkontakte/icons/dist/28/game_outline';

import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';
import $ from 'jquery';

import Games from './assets/modules/Games/Games'
import Profile from './assets/modules/Profile/Profile'
import Teams from './assets/modules/Teams/Teams'
import Streams from './assets/modules/Streams/Streams'

bridge.send("VKWebAppInit", {});

bridge
    .send('VKWebAppGetUserInfo')
    .then(result => {
        console.log(result);
        bridge
            .send("VKWebAppStorageSet", { "key": "profile", "value": JSON.stringify(result) })
            .then(result => {
                console.log(result);
        })})
    .catch(error => {});

bridge.send("VKWebAppRetargetingPixel", {"pixel_code": "VK-RTRG-447253-dUuM", "event": "click-to-button"});

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    $('body').attr('scheme', 'space_gray');
    bridge.send("VKWebAppSetViewSettings", { "status_bar_style": "light" });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const theme = e.matches ? "dark" : "light";
    if (theme === 'dark') {
        $('body').attr('scheme', 'space_gray');
        bridge.send("VKWebAppSetViewSettings", { "status_bar_style": "light" });
    } else {
        $('body').attr('scheme', 'bright_light');
        bridge.send("VKWebAppSetViewSettings", { "status_bar_style": "dark" });
}});

class App extends Component {
constructor(props) {
  super(props);
  this.state = {
    activeView  : 'streams',
    activeStory : 'streams',
    activePanel : 'streams'
  };
  this.onStoryChange = this.onStoryChange.bind(this);
}

onStoryChange(e) {
  this.setState({ activeStory: e.currentTarget.dataset.story })
  bridge.send("VKWebAppTapticImpactOccurred", { "style": "heavy" });
}

    render() {

        return (
          <Epic activeStory={this.state.activeStory} tabbar={
          <Tabbar>
          <TabbarItem data-story="team"    text={'Сообщество'}  onClick={this.onStoryChange} selected={this.state.activeStory === 'team'}><Icon28Users3Outline /></TabbarItem>
          <TabbarItem data-story="streams" text={'Трансляции'}    onClick={this.onStoryChange} selected={this.state.activeStory === 'streams'}><Icon28GameOutline /></TabbarItem>
          <TabbarItem data-story="profile" text={'Профиль'}    onClick={this.onStoryChange} selected={this.state.activeStory === 'profile'}><Icon28UserOutline /></TabbarItem>
          </Tabbar>
          }>

          <View id="team" activePanel="team">
          <Panel id="team">
          <Teams />
          </Panel>
          </View>

          <Root id="streams" activeView={this.state.activeView}>
          <View id="streams" activePanel="streams">
          <Panel id="streams">
          <Streams />
          </Panel>
          </View>

          <View id="games" activePanel="games">
          <Panel id="games">
          <Games />
          </Panel>
          </View>
          </Root> 

          <View id="profile" activePanel="profile">
          <Panel id="profile">
          <Profile />
          </Panel>
          </View>
          </Epic>
        )
    }
}

export default App;