# VK-Gaming
Разработка игрового сервиса на базе платформы VK Mini Apps, сочетающего в себе функции магазина и сетевого сообщества

<img src="https://github.com/Censored-Data/VK-Gaming/blob/main/media/image_1.png?raw=true" width="100%" />

## Оглавление

1. [API Документация](#API-Документация)
2. [Установка](#Установка)
3. [Дополнения](https://github.com/GnuriaN/format-README/blob/master/Дополнения.md)

## API Документация
<table>
   <tr>
    <th>Endpoint path</th>
    <th>Headers</th>
    <th>Description</th>
    <th>Response</th>
   </tr>
   <tr>
      <td><b> /get_top_games </b></td>
      <td> <b> limit* </b> <i> (string) </i> - максимальное количество возвращаемых объектов. По умолчанию: 10. Максимум: 100 <br/ > <br/ >
         <b> offset* </b> <i> (string) </i> - cмещение объекта для разбивки результатов на страницы. По умолчанию: 0. </td>
      <td> Получает игры, отсортированные по количеству текущих зрителей, сначала самые популярные. </td>
      <td> 
         {
  _json: {
    steamid: '76561198141890124',
    communityvisibilitystate: 3,
    profilestate: 1,
    personaname: 'M1STYNEBULA',
    commentpermission: 1,
    profileurl: 'https://steamcommunity.com/id/misty_nebula/',
    avatar: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/13/1351558f55b97fc39477f6d1de51df96ebda9cac.jpg',
    avatarmedium: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/13/1351558f55b97fc39477f6d1de51df96ebda9cac_medium.jpg',
    avatarfull: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/13/1351558f55b97fc39477f6d1de51df96ebda9cac_full.jpg',
    avatarhash: '1351558f55b97fc39477f6d1de51df96ebda9cac',
    lastlogoff: 1605950579,
    personastate: 0,
    realname: 'ADMIN',
    primaryclanid: '103582791438047740',
    timecreated: 1403614194,
    personastateflags: 0,
    loccountrycode: 'RU'
  },
  steamid: '76561198141890124',
  username: 'M1STYNEBULA',
  name: 'ADMIN',
  profile: 'https://steamcommunity.com/id/misty_nebula/',
  avatar: {
    small: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/13/1351558f55b97fc39477f6d1de51df96ebda9cac.jpg',
    medium: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/13/1351558f55b97fc39477f6d1de51df96ebda9cac_medium.jpg',
    large: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/13/1351558f55b97fc39477f6d1de51df96ebda9cac_full.jpg'
  }
}
      </td>
   </tr>
   <tr>
      <td><b> /auth/steam </b></td>
       <td> <i> null </i></td>
      <td> Эндпоинт генерации ссылки для авторизации пользователя через Steam OpenID </td>
   </tr>
   <tr>
      <td><b> /auth/steam/authenticate </b></td>
       <td> <i> null </i></td>
      <td> Эндпоинт возврата пользователя после авторизации. Получение информации о пользователе для дальнейшей работы с ним. </td>
   </tr>
   <tr><td>36,5</td><td>5</td><td>38</td></tr>
   <tr><td>37</td><td>5,5</td><td>38⅔</td></tr>
  </table>
