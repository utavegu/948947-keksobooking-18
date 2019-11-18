'use strict';

// Модуль по отрисовке меток на карте

(function () {

  var Limits = { // Ограничение по:
    TOP: 130, // Верху
    BOTTOM: 630 // Низу
  };

  var PinMain = {
    WIDTH: 40, // Ширина главной метки
    HEIGHT: 80 // Высота главной метки
  }

  var SHARP_END = 49; // От центра метки до острого конца

  // Дичь конечно, но...
  var twoCoords = document.querySelector('#address'); // Поле адреса формы подачи объявления

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
  // console.log('Координата метки по горизонтали: ' + mapPinMainX + '\n' + "Координата метки по вертикали: " + mapPinMainY);

  var mapPinMainWidth = mapPinMain.clientWidth; // Ширина главной метки
  var mapPinMainHeight = mapPinMain.clientHeight; // Высота главной метки
  // console.log('Высота метки - ' + mapPinMainHeight + '\n' + 'Ширина метки - ' + mapPinMainWidth);

  twoCoords.value = (mapPinMainX - Math.round(mapPinMainWidth / 2)) + ', ' + (mapPinMainY - Math.round(mapPinMainHeight / 2));
  // иф онклик - прибавить длину хвоста метки к Y... ты же кнопка. Тебе вроде клик и за кейпресс считается, если я ничего не путаю?


  // ФУНКЦИЯ, удаляющая все пины, кроме пользовательского
  var pinsKiller = function () {
    var otherPins = document.querySelectorAll('.map__pin:not(:first-of-type)');
    for (var i = 0; i < otherPins.length; i++) {
      otherPins[i].remove(i);
    }
  };


  // БЛОК ДВИГАНЬЯ МЕТКИ
  // ЛКМ нажали
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var target = evt.currentTarget;
  
    // Получаю координаты курсора на момент клика
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
  
    // Мышь не тащится
    var dragged = false;
  
    // ЛКМ зажата, мышь двинулась
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      // Мышь тащится
      dragged = true;

      
  
      // Получаю новые координаты ??? (смещения)
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
  
      // И меняю координаты стартовые
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
  
      // Так, вроде ж поновее метода есть, да, чем оффсеты?
      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';

      // Данные для поля "Адрес"
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
  
    // Если ЛКМ отпустили
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
  
      // Удаляю отработавшие обработчики
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
  
      // Если мышь тащится, то:
      if (dragged) {
        var onClickPreventDefault = function (defEvt) {
          defEvt.preventDefault(); // Отмени действие по умолчанию и удали слушатель
          window.pin.mapPinMain.removeEventListener('click', onClickPreventDefault);
        }; // и / или - добавь слушатель
        window.pin.mapPinMain.addEventListener('click', onClickPreventDefault);
      }
  
    };
  
    // Вернуть слушатель перемещения и отжатия
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
