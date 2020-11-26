# VK-Gaming
![https://img.shields.io/badge/Python-3.7.5-blue](https://img.shields.io/badge/Python-3.7.5-blue)
![https://img.shields.io/badge/Node%20JS-13.14.0-brightgreen](https://img.shields.io/badge/Node%20JS-13.14.0-brightgreen)
![https://img.shields.io/badge/React%20JS-17.0.1-blueviolet](https://img.shields.io/badge/React%20JS-17.0.1-blueviolet)
<br />

Разработка игрового рекомендательного сервиса на базе платформы VK Mini Apps, сочетающего в себе функции магазина и сетевого сообщества

## Оглавление

1. [API Документация](#API-Документация)
2. [Установка](#Установка)
3. [Галерея](#Галерея)
4. [Установка](#Установка)
4. [Дополнения](https://github.com/GnuriaN/format-README/blob/master/Дополнения.md)

<img src="https://github.com/Censored-Data/VK-Gaming/blob/main/media/image_1.png?raw=true" width="100%" />


## API Документация
<table>
   <tr>
    <th>Endpoint path</th>
    <th>Headers</th>
    <th>Description</th>
   </tr>
   <tr>
      <td><b> /games/top </b></td>
      <td> <b> limit* </b> <i> (string) </i> - максимальное количество возвращаемых объектов. По умолчанию: 10. Максимум: 100 <br/ > <br/ >
         <b> offset* </b> <i> (string) </i> - cмещение объекта для разбивки результатов на страницы. По умолчанию: 0. </td>
      <td> Эндпоинт для вывода игр, отсортированных по количеству текущих зрителей, сначала самые популярные. </td>
   </tr>
   </tr>
      <tr>
      <td><b> /services/connected </b></td>
      <td> <br /> <b> referer* </b> <i> (string) </i> - url текущего местоположения пользователя на странице внутри сервиса <br/ > <br/ >
         <b> hash* </b> <i> (string) </i> - Цифровая подпись для верификации пользователя и дальнейшего взаимодействия с ним. Формируется через алгоритм хеширования MD5:  <i>md5(vk_ts + vk_user_id) </i> , где vk_ts - текущая unix метка времени, полученная из URL, а vk_user_id - идентификатор пользователя ВКонтакте <br /> </td>
      <td> Эндпоинт для вывода списка подключенных пользователем сервисов </td>
   </tr>
   <tr>
      <td><b> /auth/steam </b></td>
       <td> Отсутствуют </td>
      <td> Эндпоинт генерации ссылки для авторизации пользователя через Steam OpenID </td>
   </tr>
   <tr>
      <td><b> /auth/steam/authenticate </b></td>
       <td> Отсутствуют </td>
      <td> Эндпоинт возврата пользователя после авторизации. Получение информации о пользователе для дальнейшей работы с ним. </td>
  </table>
  
  ## Установка
  ### Frontend React.js   <kbd> Port : 4000 </kbd>
  
```sh
cd frontend
npm install
npm start
```

### Backend Node.js   <kbd> Port : 4001</kbd>
```sh
cd backend
npm install
npm start
```

### Machine Lerning   <kbd> Port : 4002</kbd>
```sh
cd ml
python3 webserver.py
```
## Дополнительно
### PM2
<i><b> PM2 </b> — менеджер процессов для JavaScript-среды Node.js</i>

#### Установка
```sh
npm install pm2 -g
```

#### Запуск среды React.js
```sh
pm2 start --name dashboard npm -- start
```

#### Запуск среды Node.js
```sh
pm2 start server.js --watch
```
