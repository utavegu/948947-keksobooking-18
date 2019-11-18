'use strict';

// Утилитный модуль
// Содержит общие переменные и функции
// Бывший утил.джээс

(function () {

  var HotKey = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    SPACE_KEYCODE: 32
  };

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
