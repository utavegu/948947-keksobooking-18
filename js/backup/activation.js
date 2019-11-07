'use strict';

(function () {

  var mapPinMain = document.querySelector('.map__pin--main'); // Пользовательская красная метка для указания места на карте
  var advertForm = document.querySelector('.ad-form'); // Форма заполнения информации об объявлении
  var advertFormFieldsets = advertForm.querySelectorAll('fieldset'); // Филдсеты формы объявления
  var mapFiltersForm = document.querySelector('.map__filters'); // Форма с фильтрами
  var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('.map__filter'); // Филдсеты формы фильтрации
  var mapFiltersFormFeature = mapFiltersForm.querySelector('.map__features'); // Дополнительные удобства формы фильтрации

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


  // ФУНКЦИЯ, показывающая карту
  var showMapElement = function (desiredSelector, deletedClass) {
    var mapElement = document.querySelector(desiredSelector);
    mapElement.classList.remove(deletedClass);
  };


  // ФУНКЦИЯ, приводящая к активному состоянию
  var putActive = function () {
    // Карта становится активной
    showMapElement('.map', 'map--faded');

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
    window.otherPins.insertTemplate(window.otherPins.advertItems, window.otherPins.renderMapPinTemplate);

    // Координаты, куда указывает метка, когда страница в акивном состоянии... ЭТОТ МОМЕНТ МОЖНО ОПТИМИЗИРОВАТЬ, НО ПОКА ПУСТЬ ТАК БУДЕТ
    inputAddress.value = (mapPinMainX - Math.round(mapPinMainWidth / 2)) + ', ' + (mapPinMainY - Math.round(mapPinMainHeight / 2) + 49);
  };


  // СЛУШАТЕЛЬ СОБЫТИЙ клика, приводящий карту в активное состояние
  mapPinMain.addEventListener('mousedown', putActive);
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      putActive();
    }
  });


  // ОТСЮДА И ДО КОНЦА - СЛУШАТЕЛЬ ДВИГАНЬЯ МЕТКИ

  // Мап пин - сама метка, за которую (и которую) и будем таскать. То есть то, за что таскаем и то, что таскаем - одна и та же сущность
  // dialogHandler = mapPinMain
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

})();
