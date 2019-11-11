'use strict';

// var COUNT_OF_ADVERT = 8; // Количество объявлений
// var FIELD_MIN_HEIGHT = 130; // Минимальная высота на карте
// var FIELD_MAX_HEIGHT = 630; // Максимальная высота на карте

// Определил ширину карты
// var map = document.querySelector('.map'); // Вся карта
// var fieldWidth = map.clientWidth; // Её ширина

// ПОКА ПРОДУБЛИРУЮ ИХ ЧИСТО ДЛЯ УДОБСТВА, НО ПОТОМ СУЙ ВСЁ В МОДУЛЬ
var mapFiltersForm = document.querySelector('.map__filters'); // Форма с фильтрами
var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('.map__filter'); // Филдсеты формы фильтрации
var mapFiltersFormFeature = mapFiltersForm.querySelector('.map__features'); // Дополнительные удобства формы фильтрации

// ФУНКЦИЯ, показывающая карту
var showMapElement = function (desiredSelector, deletedClass) {
  var mapElement = document.querySelector(desiredSelector);
  mapElement.classList.remove(deletedClass);
};

// ФУНКЦИЯ, приводящая нужные элементы в неактивное состояние
var putInactive = function () {
  // Заблокировать форму объявления
  for (var i = 0; i < window.adForm.advertFormFieldsets.length; i++) {
    window.adForm.advertFormFieldsets[i].setAttribute('disabled', 'disabled');
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
  window.adForm.advertForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < window.adForm.advertFormFieldsets.length; i++) {
    window.adForm.advertFormFieldsets[i].removeAttribute('disabled');
  }

  // Форма фильтрации становится активной (В ФУНКЦИЮ)
  for (var j = 0; j < mapFiltersFormSelects.length; j++) {
    mapFiltersFormSelects[j].removeAttribute('disabled');
  }
  // И её блок с дополнительными удобствами
  mapFiltersFormFeature.removeAttribute('disabled');

  // Координаты, куда указывает метка, когда страница в акивном состоянии... ЭТОТ МОМЕНТ МОЖНО ОПТИМИЗИРОВАТЬ, НО ПОКА ПУСТЬ ТАК БУДЕТ
  window.adForm.inputAddress.value = (window.pin.mapPinMainX - Math.round(window.pin.mapPinMainWidth / 2)) + ', ' + (window.pin.mapPinMainY - Math.round(window.pin.mapPinMainHeight / 2) + 49);


  /*
  ОТСЮДА И ДО КОНЦА ДАННОЙ ФУНКЦИИ Я ПОНИМАЮ, ЧТО ЗНАТНУЮ ЕБАНИНУ СДЕЛАЛ, 
  НО МНЕ БОЛЬНО УЖ ОХОТА ЗАКРЫТЬ МОДУЛЬ 7
  ЧИСТО ФОРМАЛЬНО ЗАДАНИЕ Я ВЫПОЛНИЛ, 
  ТАК ЧТО ПУСТЬ ПОКА ТАК БУДЕТ, ПОТОМ БУДУ ЧИНИТЬ
  */

  // Полученные с сервера данные положил в переменную
  var advertItems = cards;
  // И отрисуем их все
  window.pin.insertTemplate(advertItems, window.pin.renderMapPinTemplate);

  // Функция для отображения не более 5 пинов
  var filtredNoMore5 = function (array) {
    window.pin.pinsKiller();
    var newArray = array.slice(0, 5);
    console.log(newArray);
    return newArray;
  }

  // Обрезаю массив до максимум 5
  advertItems = filtredNoMore5(advertItems);
  window.pin.insertTemplate(advertItems, window.pin.renderMapPinTemplate);

  // СЛУШАТЕЛЬ СОБЫТИЯ смены значения селекта НА ФОРМЕ (потому пока действует на все селекты)
  mapFiltersForm.addEventListener('change', function (evt) {
    if (evt.target.value === "any") {
      advertItems = filtredNoMore5(advertItems);
      window.pin.insertTemplate(advertItems, window.pin.renderMapPinTemplate);
    } else {
      window.pin.pinsKiller();
      var filteredAdvertItems = cards
      .slice() // Слайс, наставник говорит, тоже лишний
      .filter(function (currentItem) {
        return currentItem.offer.type == evt.target.value;
      });
      filteredAdvertItems = filtredNoMore5(filteredAdvertItems);
      window.pin.insertTemplate(filteredAdvertItems, window.pin.renderMapPinTemplate);
      };
  });
// Для пущей гибкости то, где сейчас тайп - так же должно быть переменной

};




// СЛУШАТЕЛИ СОБЫТИЙ, приводящие карту в активное состояние
window.pin.mapPinMain.addEventListener('mousedown', function () {
  window.dump.load(window.dump.KEKSOBOOKING_UPLOAD_LINK, putActive, window.dump.logMessages);
});

window.pin.mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === window.util.ENTER_KEYCODE) {
    window.dump.load(window.dump.KEKSOBOOKING_UPLOAD_LINK, putActive, window.dump.logMessages);
  }
});




// БЛОК ДВИГАНЬЯ МЕТКИ
// И ты тоже из модуля должен работать вроде
window.pin.mapPinMain.addEventListener('mousedown', function (evt) {
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

    window.pin.mapPinMain.style.top = (window.pin.mapPinMain.offsetTop - shift.y) + 'px';
    window.pin.mapPinMain.style.left = (window.pin.mapPinMain.offsetLeft - shift.x) + 'px';

  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    // Временное решение с shadow evt
    if (dragged) {
      var onClickPreventDefault = function (evt1) {
        evt1.preventDefault();
        window.pin.mapPinMain.removeEventListener('click', onClickPreventDefault);
      };
      window.pin.mapPinMain.addEventListener('click', onClickPreventDefault);
    }

  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});



// СЛУШАТЕЛЬ СОБЫТИЯ инпута количества комнат (а ему обязательно быть тут? в модуле вроде тоже должен работать)
window.adForm.roomsAmount.addEventListener('change', function (evt) {
  window.adForm.checkRooms(evt.target.value);
});

