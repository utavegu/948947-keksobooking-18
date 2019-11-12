'use strict';

// Модуль формы объявления

(function () {

  var advertForm = document.querySelector('.ad-form'); // Форма заполнения информации об объявлении
  var advertFormFieldsets = advertForm.querySelectorAll('fieldset'); // Филдсеты формы объявления

  // Поле адреса формы подачи объявления
  var inputAddress = advertForm.querySelector('#address');
  // Координаты, куда указывает метка, когда страница в неактивном состоянии (передаю это значение в поле адреса)
  inputAddress.value = (window.pin.mapPinMainX - Math.round(window.pin.mapPinMainWidth / 2)) + ', ' + (window.pin.mapPinMainY - Math.round(window.pin.mapPinMainHeight / 2));


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


  window.adForm = {
    advertForm: advertForm,
    advertFormFieldsets: advertFormFieldsets,
    inputAddress: inputAddress,
    roomsAmount: roomsAmount,
    checkRooms: checkRooms
  };

})();
