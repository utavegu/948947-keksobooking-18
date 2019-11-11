'use strict';

// Модуль по отрисовке меток на карте

(function () {

  // Берем шаблон #pin -- строка 232
  // И достаем его содержимое
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
      fragment.appendChild(renderingTemplateFunction(arrayObjects[i]));
    }
    similarMapPinsListElement.appendChild(fragment);
  };


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

  // ФУНКЦИЯ, удаляющая все пины, кроме пользовательского
  var pinsKiller = function () {
    var otherPins = document.querySelectorAll('.map__pin:not(:first-of-type)');
      for (var i = 0; i < otherPins.length; i++) {
        otherPins[i].remove(i);
      }
  };

  window.pin = {
    renderMapPinTemplate: renderMapPinTemplate,
    insertTemplate: insertTemplate,
    mapPinMain: mapPinMain,
    mapPinMainX: mapPinMainX,
    mapPinMainY: mapPinMainY,
    mapPinMainWidth: mapPinMainWidth,
    mapPinMainHeight: mapPinMainHeight,
    pinsKiller: pinsKiller
  };

})();
