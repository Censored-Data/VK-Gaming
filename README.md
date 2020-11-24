# VK-Gaming
Разработка игрового сервиса на базе платформы VK Mini Apps, сочетающего в себе функции магазина и сетевого сообщества

<img src="https://github.com/Censored-Data/VK-Gaming/blob/main/media/image_1.png?raw=true" width="100%" />

## Оглавление

0. [Команда](#Команда)
1. [API Документация](#API-Документация)
2. [Работа с выделением текста](#Работа-с-выделением-текста)
3. [Использование эмодзи (emoji)](#Использование-эмодзи-emoji)
4. [Использование цитирования в тексте](#Использование-цитирования-в-тексте)
5. [Подсветка кода](#Подсветка-кода)
6. [Установка](#Установка)
    1. [React](#Маркированный)
    2. [NodeJS](#Нумерованный)
    3. [Python](#Смешанные-списки)
7. [Дополнения](https://github.com/GnuriaN/format-README/blob/master/Дополнения.md)

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
   <tr><td>35,5</td><td>4</td><td>36⅔</td></tr>
   <tr><td>36</td><td>4,5</td><td>37⅓</td></tr>
   <tr><td>36,5</td><td>5</td><td>38</td></tr>
   <tr><td>37</td><td>5,5</td><td>38⅔</td></tr>
  </table>
