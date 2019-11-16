'use strict';

// Утилитный модуль
// Бывший утил.джээс
// Содержит общие переменные и функции

(function () {

  var HotKey = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    SPACE_KEYCODE: 32
  };

  // Нафига ты тут?
  var map = document.querySelector('.map'); // Вся карта
  var fieldWidth = map.clientWidth; // Её ширина

  
  window.util = {
    ESC_KEYCODE: HotKey.ESC_KEYCODE,
    ENTER_KEYCODE: HotKey.ENTER_KEYCODE,
    SPACE_KEYCODE: HotKey.SPACE_KEYCODE,
    map: map,
    fieldWidth: fieldWidth
  };

})();

/*

  Пусть пока будет, возможно улучшу до такого варианта

  (function () {
    var ESC_KEYCODE = 27;
    var ENTER_KEYCODE = 13;

    window.util = {
      isEscEvent: function (evt, action) {
        if (evt.keyCode === ESC_KEYCODE) {
          action();
        }
      },
      isEnterEvent: function (evt, action) {
        if (evt.keyCode === ENTER_KEYCODE) {
          action();
        }
      }
    };
  })();
  */
