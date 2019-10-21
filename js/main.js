'use strict';

var COUNT_OF_ADVERT = 8; // Количество объявлений
var FIELD_MIN_HEIGHT = 130; // Минимальная высота на карте
var FIELD_MAX_HEIGHT = 630; // Максимальная высота на карте
var TITLES = ['Бюджетная Харчевня', 'Таверна УО', 'Царская забегаловка', 'Элитарный клоповник', 'Свободная комната в профурсетской', 'Вписка "У корешей"', 'Под картонкой у бомжа', 'Туалет кинотеатра'];
var DESCRIPTIONS = ['Клопы тут не кусают... сытые', 'Мешают кутилы и профурсетки? Заткни уши!', '3 доллара или шкалик сивухи', 'Таверна без драки, деньги на ветер', 'Взятку сторожу и проходи', 'Бесплатно, если скажешь, что корешь лохматого', 'Туалет в 20-ой комнате'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var ENTER_KEYCODE = 13;
// var ESC_KEYCODE = 27;

// Определили ширину карты
var map = document.querySelector('.map');
var fieldWidth = map.clientWidth;

// ФУНКЦИЯ генерации координаты X
var generateCoordinateX = function (countIndexes) {
  var resultVariable = [];
  for (var i = 0; i < countIndexes; i++) {
    var coord = Math.floor(Math.random() * fieldWidth);
    resultVariable.push(coord);
  }
  return resultVariable;
};

// ФУНКЦИЯ генерации координаты Y
var generateCoordinateY = function (countIndexes) {
  var resultVariable = [];
  for (var i = 0; i < countIndexes; i++) {
    var coord = FIELD_MIN_HEIGHT + Math.floor(Math.random() * (FIELD_MAX_HEIGHT - FIELD_MIN_HEIGHT));
    resultVariable.push(coord);
  }
  return resultVariable;
};

// ФУНКЦИЯ генерации адреса
var generateAddresses = function (countIndexes) {
  var resultVariable = [];
  for (var i = 0; i < countIndexes; i++) {
    var address = String(coordinatesX[i]) + ', ' + String(coordinatesY[i]);
    resultVariable.push(address);
  }
  return resultVariable;
};

var coordinatesX = generateCoordinateX(COUNT_OF_ADVERT);
var coordinatesY = generateCoordinateY(COUNT_OF_ADVERT);
var addreses = generateAddresses(COUNT_OF_ADVERT);

var getRandomInteger = function (max, min) {
  var minValue = min || 0;
  return Math.round(minValue + Math.random() * (max - minValue));
};

// ФУНКЦИЯ, возвращающая случайный элемент массива
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

// Массив объявлений (объектов)
var advertItems = createAdvert(COUNT_OF_ADVERT);

// Шаблон #pin -- строка 232
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


// ПОКА ГОВНОКОДЬ, НО НЕ ЗАБУДЬ ПОТОМ ИЗБАВИТЬСЯ ОТ МАГИЧЕСКИХ ЧИСЕЛ И УПАКОВАТЬ ВСЁ ПО ФУНКЦИЯМ

var mapPinMain = document.querySelector('.map__pin--main'); // Красная пипка, за которую нужно дёргать
var advertForm = document.querySelector('.ad-form'); // Форма заполнения информации об объявлении
var advertFormFieldsets = advertForm.querySelectorAll('fieldset'); // Филдсеты формы объявления
var mapFiltersForm = document.querySelector('.map__filters'); // Форма с фильтрами
var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('.map__filter'); // Филдсеты формы фильтрации
var mapFiltersFormFeature = mapFiltersForm.querySelector('.map__features'); // Дополнительные удобства формы фильтрации

// Функция, приводящая нужные элементы в неактивное состояние
var putInactive = function () {
  // Заблокировать форму объявления
  for (var i = 0; i < advertFormFieldsets.length; i++) {
    advertFormFieldsets[i].setAttribute('disabled', 'disabled');
  }

  // Заблокировать форму фильтрации
  for (var j = 0; j < mapFiltersFormSelects.length; j++) {
    mapFiltersFormSelects[j].disabled = 'disabled';
  }

  // И её блок с удобствами
  mapFiltersFormFeature.disabled = 'disabled';
};

// СЛУШАТЕЛЬ СОБЫТИЙ, приводящий страницу в неактивное состояние
document.addEventListener('DOMContentLoaded', putInactive);

// ФУНКЦИЯ, показывающая карту
var showMapElement = function (desiredSelector, deletedClass) {
  var mapElement = document.querySelector(desiredSelector);
  mapElement.classList.remove(deletedClass);
};

// ФУНКЦИЯ, приводящая к активному состоянию
var putActive = function () {
  showMapElement('.map', 'map--faded'); // Карта становится активной

  // Форма объявлений становится активной... почти
  advertForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < advertFormFieldsets.length; i++) {
    advertFormFieldsets[i].removeAttribute('disabled');
  }

  // Форма фильтрации становится активной
  for (var j = 0; j < mapFiltersFormSelects.length; j++) {
    mapFiltersFormSelects[j].removeAttribute('disabled');
  }

  // И её блок с дополнительными удобствами
  mapFiltersFormFeature.removeAttribute('disabled');

  // Отображение похожих объявлений
  insertTemplate(advertItems, renderMapPinTemplate);

  // Координаты, куда указывает метка, когда страница в акивном состоянии... ЭТОТ МОМЕНТ МОЖНО ОПТИМИЗИРОВАТЬ, НО ПОКА ПУСТЬ ТАК БУДЕТ
  inputAddress.value = (mapPinMainX - Math.round(mapPinMainWidth / 2)) + ', ' + (mapPinMainY - Math.round(mapPinMainHeight / 2) + 49);
};

// СЛУШАТЕЛЬ СОБЫТИЙ клика, приводящий карту в активное состояние
mapPinMain.addEventListener('mousedown', putActive);
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    putActive();
  }
});

// Координата Х главной метки
var mapPinMainX = mapPinMain.style.left;
mapPinMainX = mapPinMainX.substring(0, mapPinMainX.length - 2);

// Координата У главной метки
var mapPinMainY = mapPinMain.style.top;
mapPinMainY = mapPinMainY.substring(0, mapPinMainY.length - 2);
// console.log('Координата метки по горизонтали: ' + mapPinMainX + '\n' + "Координата метки по вертикали: " + mapPinMainY);

var mapPinMainWidth = mapPinMain.clientWidth; // Ширина главной метки
var mapPinMainHeight = mapPinMain.clientHeight; // Высота главной метки
// console.log('Высота метки - ' + mapPinMainHeight + '\n' + 'Ширина метки - ' + mapPinMainWidth);

var inputAddress = advertForm.querySelector('#address'); // Поле адреса формы подачи объявления
// Координаты, куда указывает метка, когда страница в неактивном состоянии
inputAddress.value = (mapPinMainX - Math.round(mapPinMainWidth / 2)) + ', ' + (mapPinMainY - Math.round(mapPinMainHeight / 2));

var roomsAmount = document.querySelector('#room_number'); // Количество комнат
var guestsAmount = document.querySelector('#capacity'); // Количество гостей

// Соответствие комнат и гостей
var roomValues = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

function checkRooms(peopleAmount) {
  // Получаем коллекцию вариантов выбора селекта гостей
  var guestsAmountOptions = guestsAmount.querySelectorAll('option');

  // Задизабливаем каждый пункт
  guestsAmountOptions.forEach(function (option) {
    option.disabled = true;
  });

  roomValues[peopleAmount].forEach(function (seatsAmount) {
    guestsAmountOptions.forEach(function (option) {
      if (Number(option.value) === seatsAmount) {
        option.disabled = false;
        option.selected = true;
      }
    });
  });
}

roomsAmount.addEventListener('change', function (evt) {
  checkRooms(evt.target.value);
});
