'use strict';

var COUNT_OF_ADVERT = 8;

var AVATAR = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08'
];

var TITLE = [
  'Бюджетная Харчевня',
  'Таверна УО',
  'Царская забегаловка',
  'Элитарный клоповник',
  'Свободная комната в профурсетской',
  'Вписка "У корешей"',
  'Под картонкой у бомжа',
  'Туалет кинотеатра'
];

var ADDRESS = [
  '600, 350',
  '1100, 300',
  '800, 600',
  '620, 480',
  '100, 300',
  '400, 500',
  '900, 650',
  '600, 350',
  '700, 200'
];

var PRICE = [
  3,
  5,
  8.5,
  12,
  9.99,
  15,
  50,
  33
];

var TYPE = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var ROOMS = [
  0,
  1,
  2,
  3,
  4,
  5,
  20
];

var GUESTS = [
  1,
  2,
  3,
  4,
  6,
  8,
  10,
  15,
  20,
  50
];

var CHECKIN = [
  '12:00',
  '13:00',
  '14:00'
];

var CHECKOUT = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var DESCRIPTION = [
  'Клопы тут не кусают... сытые',
  'Мешают кутилы и профурсетки? Заткни уши!',
  '3 доллара или шкалик сивухи',
  'Таверна без драки, деньги на ветер',
  'Взятку сторожу и проходи',
  'Бесплатно, если скажешь, что корешь лохматого',
  'Туалет в 20-ой комнате'
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var COORDINATE_X = [
  150,
  280,
  340,
  470,
  590,
  670,
  800,
  1020
];

var COORDINATE_Y = [
  140,
  205,
  310,
  405,
  508,
  547,
  583,
  625
];

var mapElement = document.querySelector('.map ');
mapElement.classList.remove('map--faded');

// Функция получения рандомного индекса элемента массива
var getRandomIndexElement = function (arr) {
  var minIndex = 0;
  var maxIndex = arr.length;
  return Math.floor(Math.random() * ((maxIndex - minIndex) + minIndex));
};

// ПОЧИНИ, ЧТОБЫ НЕ БЫЛО ПОВТОРНЫХ ЭЛЕМЕНТОВ... пока не чини, гуру одобряет

// ФУНКЦИЯ получения рандомного элемента массива
var getRandomArrayElement = function (arr) {
  var randomIndex = getRandomIndexElement(arr);
  return arr[randomIndex];
};

// ФУНКЦИЯ создания объекта
var createAdvert = function (countOfAdvert) {
  var advert = [];
  for (var i = 0; i < countOfAdvert; i++) {
    advert.push({
      author: {
        avatar: getRandomArrayElement(AVATAR)
      },
      offer: {
        title: getRandomArrayElement(TITLE),
        address: getRandomArrayElement(ADDRESS),
        price: getRandomArrayElement(PRICE),
        type: getRandomArrayElement(TYPE),
        rooms: getRandomArrayElement(ROOMS),
        guests: getRandomArrayElement(GUESTS),
        checkin: getRandomArrayElement(CHECKIN),
        checkout: getRandomArrayElement(CHECKOUT),
        features: getRandomArrayElement(FEATURES),
        description: getRandomArrayElement(DESCRIPTION),
        photos: getRandomArrayElement(PHOTOS)
      },
      location: {
        x: getRandomArrayElement(COORDINATE_X),
        y: getRandomArrayElement(COORDINATE_Y),
      },
    });
  }
  return advert;
};

window.advert = createAdvert(COUNT_OF_ADVERT);

var advertItems = window.advert;

// Я ПОКА ОСТАВЛЮ ЭТОТ КОД, НА СЛУЧАЙ ЕСЛИ МОЯ ПОПЫТКА С ОБЪЕКТОМ - ШЛЯПА
// ЭТО ВРОДЕ ФУНКЦИЯ-КОНСТРУКТОР КАК РАЗ... или нет?
// var createAdvert = function (avatar, title, address, price, type, rooms, guests, checkin, checkout, features, description, photos, x, y, countOfAdvert) {
//   var advert = [];
//   for (var i = 0; i < countOfAdvert; i++) {
//     advert.push({
//       author: {
//         avatar: getRandomArrayElement(avatar)
//       },
//       offer: {
//         title: getRandomArrayElement(title),
//         price: getRandomArrayElement(price),
//         type: getRandomArrayElement(type),
//         rooms: getRandomArrayElement(rooms),
//         guests: getRandomArrayElement(guests),
//         checkin: getRandomArrayElement(checkin),
//         checkout: getRandomArrayElement(checkout),
//         features: getRandomArrayElement(features),
//         description: getRandomArrayElement(description),
//         photos: getRandomArrayElement(photos)
//       },
//       location: {
//         x: getRandomArrayElement(x),
//         y: getRandomArrayElement(y),
//       },
//     });
//   }
//   return advert;
// };
//
//
// var advertItems = createAdvert(AVATAR, TITLE, ADDRESS, PRICE, TYPE, ROOMS, GUESTS, CHECKIN, CHECKOUT, FEATURES, DESCRIPTION, PHOTOS, COORDINATE_X, COORDINATE_Y, COUNT_OF_ADVERT);


// Шаблон #pin
var similarMapPinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');

// Место для вставки шаблона #pin
var similarMapPinsListElement = document.querySelector('.map__pins');

// Функция отрисовки шаблона #pin
var renderMapPinTemplate = function (innerAdvertItems) {
  var templateMapPinElement = similarMapPinTemplateElement.cloneNode(true);
  templateMapPinElement.style.left = innerAdvertItems.location.x + 'px';
  templateMapPinElement.style.top = innerAdvertItems.location.y + 'px';
  templateMapPinElement.querySelector('img').src = innerAdvertItems.author.avatar;
  templateMapPinElement.querySelector('img').alt = innerAdvertItems.offer.title;

  return templateMapPinElement;
};

// Вставка шаблона #pin в .map__pins
var fragment = document.createDocumentFragment();

for (var i = 0; i < advertItems.length; i++) {
  fragment.appendChild(renderMapPinTemplate(advertItems[i]));
}

similarMapPinsListElement.appendChild(fragment);
