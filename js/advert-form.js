'use strict';

(function () {

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

})();
