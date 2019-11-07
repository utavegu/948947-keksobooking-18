'use strict';

// var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
// var SPACE_KEYCODE = 32;

// var COUNT_OF_ADVERT = 8; // Количество объявлений
// var FIELD_MIN_HEIGHT = 130; // Минимальная высота на карте
// var FIELD_MAX_HEIGHT = 630; // Максимальная высота на карте
var KEKSOBOOKING_UPLOAD_LINK = 'https://js.dump.academy/keksobooking/data';
var DUMP_TIMEOUT = 10000; // В одной секунде - 1000 миллисекунд!

var advertForm = document.querySelector('.ad-form'); // Форма заполнения информации об объявлении
var advertFormFieldsets = advertForm.querySelectorAll('fieldset'); // Филдсеты формы объявления

var mapFiltersForm = document.querySelector('.map__filters'); // Форма с фильтрами
var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('.map__filter'); // Филдсеты формы фильтрации
var mapFiltersFormFeature = mapFiltersForm.querySelector('.map__features'); // Дополнительные удобства формы фильтрации

// ГЛАВНАЯ МЕТКА
var mapPinMain = document.querySelector('.map__pin--main'); // Пользовательская красная метка для указания места на карте
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

// Поле адреса формы подачи объявления
var inputAddress = advertForm.querySelector('#address');
// Координаты, куда указывает метка, когда страница в неактивном состоянии
inputAddress.value = (mapPinMainX - Math.round(mapPinMainWidth / 2)) + ', ' + (mapPinMainY - Math.round(mapPinMainHeight / 2));

// Определил ширину карты
// var map = document.querySelector('.map'); // Вся карта
// var fieldWidth = map.clientWidth; // Её ширина


// ФУНКЦИЯ ДЛЯ РАБОТЫ С СЕРВЕРОМ (пока только получение данных)
var load = function (url, onSuccess, onError) {
  var xhr = new XMLHttpRequest(); // Инициализировал объект
  xhr.responseType = 'json'; // Сказал в каком формате хочу данные
  xhr.timeout = DUMP_TIMEOUT; // Не дольше 10 секунд

  xhr.addEventListener('load', function () { // Если загрузка прошла успешно
    if (xhr.status === 200) { // И статус ответа что надо
      onSuccess(xhr.response); // Верни данные
    } else {
      onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText); // Иначе отобрази статус ответа и его текст
    }
  });

  xhr.addEventListener('error', function () { // Если в запросе произошла ошибка
    onError('Ошибка соединения'); // Сообщи об этом
  });

  xhr.addEventListener('timeout', function () { // Если заданный интервал превышен
    onError('Запрос не успел выполниться за ' + xhr.timeout / 1000 + ' сек.'); // Выдай ошибку и объясни в чём дело
  });

  // По идее эти 2 действия по порядку идут 2 и 3, но так правильнее
  xhr.open('GET', url); // Открываю соединение
  xhr.send(); // Посылаю запрос
};


// ФУНКЦИЯ, показывающая карту
var showMapElement = function (desiredSelector, deletedClass) {
  var mapElement = document.querySelector(desiredSelector);
  mapElement.classList.remove(deletedClass);
};


// ФУНКЦИЯ, приводящая нужные элементы в неактивное состояние
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


// ФУНКЦИЯ ПРИВОДЯЩАЯ ПРИЛОЖЕНИЕ В АКТИВНОЕ СОСТОЯНИЕ
var putActive = function (cards) {

  // Карта становится активной
  showMapElement('.map', 'map--faded');

  // Форма объявлений становится активной... почти (В ФУНКЦИЮ)
  advertForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < advertFormFieldsets.length; i++) {
    advertFormFieldsets[i].removeAttribute('disabled');
  }

  // Форма фильтрации становится активной (В ФУНКЦИЮ)
  for (var j = 0; j < mapFiltersFormSelects.length; j++) {
    mapFiltersFormSelects[j].removeAttribute('disabled');
  }
  // И её блок с дополнительными удобствами
  mapFiltersFormFeature.removeAttribute('disabled');

  // Координаты, куда указывает метка, когда страница в акивном состоянии... ЭТОТ МОМЕНТ МОЖНО ОПТИМИЗИРОВАТЬ, НО ПОКА ПУСТЬ ТАК БУДЕТ
  inputAddress.value = (mapPinMainX - Math.round(mapPinMainWidth / 2)) + ', ' + (mapPinMainY - Math.round(mapPinMainHeight / 2) + 49);


  // ТОЖЕ ЭТОТ КУСОК В ОТДЕЛЬНУЮ ФУНКЦИЮ
  window.advertItems = cards;
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
    // Отображение похожих объявлений
  insertTemplate(advertItems, renderMapPinTemplate);
};

// Сообщение об ошибке при загрузке данных с сервера
var logMessages = function (text) {
  // console.log(text);
  // alert(text); //Нет консоль логам? Фигня вопрос!
  var errorTemplateElement = document.querySelector('#error').content.querySelector('.error');
  var mainBlock = document.querySelector('main');
  var templateMapPinElement = errorTemplateElement.cloneNode(true);
  mainBlock.appendChild(templateMapPinElement);
};


// СЛУШАТЕЛИ СОБЫТИЙ, приводящие карту в активное состояние
mapPinMain.addEventListener('mousedown', function () {
  load(KEKSOBOOKING_UPLOAD_LINK, putActive, logMessages);
});

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    load(KEKSOBOOKING_UPLOAD_LINK, putActive, logMessages);
  }
});


// БЛОК ДВИГАНЬЯ МЕТКИ

mapPinMain.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var dragged = false;

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    dragged = true;

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
    mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';

  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    // Временное решение с shadow evt
    if (dragged) {
      var onClickPreventDefault = function (evt1) {
        evt1.preventDefault();
        mapPinMain.removeEventListener('click', onClickPreventDefault);
      };
      mapPinMain.addEventListener('click', onClickPreventDefault);
    }

  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});


// БЛОК КОМНАТ И ГОСТЕЙ В ФОРМЕ ОБЪЯВЛЕНИЯ

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
