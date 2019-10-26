'use strict';

// Утилитный модуль
// Содержит общие переменные и функции
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var SPACE_KEYCODE = 32;

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    ENTER_KEYCODE: ENTER_KEYCODE,
    SPACE_KEYCODE: SPACE_KEYCODE
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
