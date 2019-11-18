'use strict';

// Модуль по отрисовке меток на карте

(function () {

  // Ограничение по:
  var Limits = {
    TOP: 130, // Верху
    BOTTOM: 630 // Низу
  };

  var PinMain = {
    WIDTH: 40, // Ширина главной метки
    HEIGHT: 80 // Высота главной метки
  };

  var SHARP_END = 49; // От центра метки до острого конца

  var twoCoords = document.querySelector('#address'); // Поле адреса формы подачи объявления

  // Берем шаблон #pin и его содержимое
  var similarMapPinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');

  // Место для вставки шаблона
  var similarMapPinsListElement = document.querySelector('.map__pins');

  // ФУНКЦИЯ отрисовки шаблона
  var renderMapPinTemplate = function (innerAdvertItem) {
    var templateMapPinElement = similarMapPinTemplateElement.cloneNode(true);
    templateMapPinElement.style.left = innerAdvertItem.location.x + 'px';
    templateMapPinElement.style.top = innerAdvertItem.location.y + 'px';
    templateMapPinElement.querySelector('img').src = innerAdvertItem.author.avatar;
    templateMapPinElement.querySelector('img').alt = innerAdvertItem.offer.title;

    // Слушатель клика по метке (отрисовка визиток)
    templateMapPinElement.addEventListener('click', function () {
      var advertisementCard = window.util.map.querySelector('.map__card');
      if (advertisementCard) {
        window.util.map.removeChild(advertisementCard);
      }
      window.util.map.appendChild(window.cutaway.renderAdvertisementCard(innerAdvertItem));
    });

    return templateMapPinElement;
  };

  // ФУНКЦИЯ вставки шаблона #pin в .map__pins
  var insertTemplate = function (arrayObjects, renderingTemplateFunction) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayObjects.length; i++) {
      fragment.appendChild(renderingTemplateFunction(arrayObjects[i]));
    }
    similarMapPinsListElement.appendChild(fragment);
  };

  // ГЛАВНАЯ МЕТКА
  var mapPinMain = document.querySelector('.map__pin--main'); // Пользовательская красная метка для указания места на карте

  var mapPinMainX = mapPinMain.style.left.substring(0, mapPinMain.style.left.length - 2); // Координата Х главной метки
  var mapPinMainY = mapPinMain.style.top.substring(0, mapPinMain.style.top.length - 2); // Координата У главной метки

  var mapPinMainWidth = mapPinMain.clientWidth; // Ширина главной метки
  var mapPinMainHeight = mapPinMain.clientHeight; // Высота главной метки

  twoCoords.value = (mapPinMainX - Math.round(mapPinMainWidth / 2)) + ', ' + (mapPinMainY - Math.round(mapPinMainHeight / 2));

  // ФУНКЦИЯ, удаляющая все пины, кроме пользовательского
  var pinsKiller = function () {
    var otherPins = document.querySelectorAll('.map__pin:not(:first-of-type)');
    for (var i = 0; i < otherPins.length; i++) {
      otherPins[i].remove(i);
    }
  };

  // БЛОК ДВИГАНЬЯ МЕТКИ
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var target = evt.currentTarget;
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
      twoCoords.value = ((mapPinMain.offsetLeft - shift.x) + ', ' + ((mapPinMain.offsetTop - shift.y) + SHARP_END));
      window.superCrutch = twoCoords.value;

      // Ограничитель движения метки по вертикали
      if (parseInt(target.style.top, 10) < Limits.TOP) {
        target.style.top = Limits.TOP + 'px';
      } else if (parseInt(target.style.top, 10) > Limits.BOTTOM - PinMain.HEIGHT) {
        target.style.top = Limits.BOTTOM - PinMain.HEIGHT + 'px';
      }

      // Ограничитель движения метки по горизонтали
      if (parseInt(target.style.left, 10) < 0) {
        target.style.left = '0px';
      } else if (parseInt(target.style.left, 10) > window.util.fieldWidth - PinMain.WIDTH - PinMain.WIDTH / 2) {
        target.style.left = window.util.fieldWidth - PinMain.WIDTH - PinMain.WIDTH / 2 + 'px';
      }

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (dragged) {
        var onClickPreventDefault = function (defEvt) {
          defEvt.preventDefault();
          window.pin.mapPinMain.removeEventListener('click', onClickPreventDefault);
        };
        window.pin.mapPinMain.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.pin = {
    renderMapPinTemplate: renderMapPinTemplate,
    insertTemplate: insertTemplate,
    mapPinMain: mapPinMain,
    mapPinMainX: mapPinMainX,
    mapPinMainY: mapPinMainY,
    mapPinMainWidth: mapPinMainWidth,
    mapPinMainHeight: mapPinMainHeight,
    pinsKiller: pinsKiller,
    twoCoords: twoCoords
  };

})();
