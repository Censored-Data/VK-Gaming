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
   </tr>
   <tr>
      <td><b> /get_top_games </b></td>
      <td> <b> limit* </b> <i> (string) </i> - максимальное количество возвращаемых объектов. По умолчанию: 10. Максимум: 100 <br/ > <br/ >
         <b> offset* </b> <i> (string) </i> - cмещение объекта для разбивки результатов на страницы. По умолчанию: 0. </td>
      <td> Получает игры, отсортированные по количеству текущих зрителей, сначала самые популярные. </td>
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
      <tr>
      <td><b> /services/connected </b></td>
      <td> <b> referer* </b> <i> (string) </i> - URL of the user's current location on the page within the service <br/ > <br/ >
         <b> hash* </b> <i> (string) </i> - Digital signature for user verification and further interaction with him. It is formed through the MD5 hashing algorithm:  <i>md5(vk_ts + vk_user_id) </i> </td>
      <td> Получает игры, отсортированные по количеству текущих зрителей, сначала самые популярные. </td>
   </tr>
   <tr><td>37</td><td>5,5</td><td>38⅔</td></tr>
  </table>
