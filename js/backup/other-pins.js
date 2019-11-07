'use strict';

(function () {
  var COUNT_OF_ADVERT = 8; // Количество объявлений
  var FIELD_MIN_HEIGHT = 130; // Минимальная высота на карте
  var FIELD_MAX_HEIGHT = 630; // Максимальная высота на карте
  var KEKSOBOOKING_UPLOAD_LINK = 'https://js.dump.academy/keksobooking/data';

  var TITLES = ['Бюджетная Харчевня', 'Таверна УО', 'Царская забегаловка', 'Элитарный клоповник', 'Свободная комната в профурсетской', 'Вписка "У корешей"', 'Под картонкой у бомжа', 'Туалет кинотеатра'];
  var DESCRIPTIONS = ['Клопы тут не кусают... сытые', 'Мешают кутилы и профурсетки? Заткни уши!', '3 доллара или шкалик сивухи', 'Таверна без драки, деньги на ветер', 'Взятку сторожу и проходи', 'Бесплатно, если скажешь, что корешь лохматого', 'Туалет в 20-ой комнате'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKINS = ['12:00', '13:00', '14:00'];
  var CHECKOUTS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];


  // Определили ширину карты
  var map = document.querySelector('.map'); // Вся карта
  var fieldWidth = map.clientWidth; // Её ширина

  // ФУНКЦИЯ генерации координаты X
  var generateCoordinateX = function (countIndexes) {
    var resultVariable = [];
    for (var i = 0; i < countIndexes; i++) {
      var coord = Math.floor(Math.random() * fieldWidth);
      resultVariable.push(coord);
    }
    return resultVariable;
  };

  var coordinatesX = generateCoordinateX(COUNT_OF_ADVERT);


  // ФУНКЦИЯ генерации координаты Y
  var generateCoordinateY = function (countIndexes) {
    var resultVariable = [];
    for (var i = 0; i < countIndexes; i++) {
      var coord = FIELD_MIN_HEIGHT + Math.floor(Math.random() * (FIELD_MAX_HEIGHT - FIELD_MIN_HEIGHT));
      resultVariable.push(coord);
    }
    return resultVariable;
  };

  var coordinatesY = generateCoordinateY(COUNT_OF_ADVERT);


  // ФУНКЦИЯ генерации адреса
  var generateAddresses = function (countIndexes) {
    var resultVariable = [];
    for (var i = 0; i < countIndexes; i++) {
      var address = String(coordinatesX[i]) + ', ' + String(coordinatesY[i]);
      resultVariable.push(address);
    }
    return resultVariable;
  };

  var addreses = generateAddresses(COUNT_OF_ADVERT);



  // ФУНКЦИЯ для получения случайного целого числа в диапазоне (в утил можно теоретически)
  var getRandomInteger = function (max, min) {
    var minValue = min || 0;
    return Math.round(minValue + Math.random() * (max - minValue));
  };

  // ФУНКЦИЯ, возвращающая случайный элемент массива (в утил можно теоретически)
  var getRandomArrayElement = function (arr) {
    var minIndex = 0;
    var maxIndex = arr.length;
    var randomIndex = Math.floor(Math.random() * ((maxIndex - minIndex) + minIndex));
    return arr[randomIndex];
  };

  // ФУНКЦИЯ создания объекта
  var createAdvert = function (countOfAdvert) {
    var advert = [];
    for (var i = 0; i < countOfAdvert; i++) {
      advert.push({
        author: {
          avatar: 'img/avatars/user' + '0' + [i + 1] + '.png'
        },
        offer: {
          title: getRandomArrayElement(TITLES),
          address: getRandomArrayElement(addreses),
          price: getRandomInteger(50),
          type: getRandomArrayElement(TYPES),
          rooms: getRandomInteger(5),
          guests: getRandomInteger(15),
          checkin: getRandomArrayElement(CHECKINS),
          checkout: getRandomArrayElement(CHECKOUTS),
          features: getRandomArrayElement(FEATURES),
          description: getRandomArrayElement(DESCRIPTIONS),
          photos: getRandomArrayElement(PHOTOS)
        },
        location: {
          x: getRandomArrayElement(coordinatesX),
          y: getRandomArrayElement(coordinatesY),
        },
      });
    }
    return advert;
  };




  var advertItems = [1, 2, 3];
  window.advertItems = advertItems;
  console.log('Я переменная window.advertItems и содержу в себе значения: ' +  window.advertItems);

 var load = function (url, onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.timeout = 10000;
  
  xhr.addEventListener('load', function () {
    if (xhr.status === 200) { 
      onSuccess(xhr.response);
    } else {
      onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
    }
  });

  xhr.addEventListener('error', function () {
    onError('Ошибка соединения');
  });

  xhr.addEventListener('timeout', function () {
    onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  });

  xhr.open('GET', url);
  xhr.send();
}

/*
  var onSuccess = function (data) {
    console.log(data);
  };

  var onError = function (message) {
    console.error(message);
  };

*/

  var logMessages = function(text) {
    console.log(text);
  }
  
  
  var startApp = function (cards) {
    //window.form.init();
    // window.cards = cards;
    // console.log(cards);
    window.advertItems = cards;
    console.log('Это снова я, но уже в стартапе: ' + window.advertItems);
  };
  
  load('https://js.dump.academy/keksobooking/data', startApp, logMessages);

  console.log('А вот тут обычно всё плохо: ' + window.advertItems);

  // Массив объявлений (объектов)
//  var advertItems = createAdvert(COUNT_OF_ADVERT);

  // Берем шаблон #pin -- строка 232
  var similarMapPinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');

  // Место для вставки шаблона #pin -- строка 22
  var similarMapPinsListElement = document.querySelector('.map__pins');

  // ФУНКЦИЯ отрисовки шаблона #pin
  var renderMapPinTemplate = function (innerAdvertItem) {
    var templateMapPinElement = similarMapPinTemplateElement.cloneNode(true);
    templateMapPinElement.style.left = innerAdvertItem.location.x + 'px';
    templateMapPinElement.style.top = innerAdvertItem.location.y + 'px';
    templateMapPinElement.querySelector('img').src = innerAdvertItem.author.avatar;
    templateMapPinElement.querySelector('img').alt = innerAdvertItem.offer.title;
    return templateMapPinElement;
  };

  // ФУНКЦИЯ вставки шаблона #pin в .map__pins
  var insertTemplate = function (arrayObjects, renderingTemplateFunction) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayObjects.length; i++) {
      fragment.appendChild(renderingTemplateFunction(advertItems[i]));
    }
    similarMapPinsListElement.appendChild(fragment);
  };

  window.otherPins = {
    renderMapPinTemplate: renderMapPinTemplate,
    insertTemplate: insertTemplate,
    advertItems: advertItems
  };

})();
