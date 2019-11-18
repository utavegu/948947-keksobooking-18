'use strict';

// Модуль формы объявления

(function () {

  var advertForm = document.querySelector('.ad-form'); // Форма заполнения информации об объявлении
  var advertFormFieldsets = advertForm.querySelectorAll('fieldset'); // Филдсеты формы объявления

  // Поля формы подачи объявления
  var headline = advertForm.querySelector('#title'); // Заголовок объявления
  var inputAddress = advertForm.querySelector('#address'); // Поле адреса формы подачи объявления
  var housingType = advertForm.querySelector('#type'); // Тип жилья
  var pricePerNight = advertForm.querySelector('#price'); // Цена за ночь
  var checkInTime = advertForm.querySelector('#timein'); // Время заезда
  var checkOutTime = advertForm.querySelector('#timeout'); // Время выезда
  var roomsAmount = advertForm.querySelector('#room_number'); // Количество комнат
  var guestsAmount = advertForm.querySelector('#capacity'); // Количество гостей

  // Соответствие комнат и гостей
  var RoomConformity = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  // ФУНКЦИЯ проверки соответствия комнат и гостей
  function checkRooms(peopleAmount) {
    var guestsAmountOptions = guestsAmount.querySelectorAll('option');
    guestsAmountOptions.forEach(function (option) {
      option.disabled = true;
    });
    RoomConformity[peopleAmount].forEach(function (seatsAmount) {
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

  // Валидация заголовка объявления
  headline.addEventListener('input', function () {
    if (headline.validity.tooShort) {
      headline.setCustomValidity('Минимум 30 символов!');
    } else if (headline.validity.tooLong) {
      headline.setCustomValidity('Максимум 100 символов!');
    } else if (headline.validity.valueMissing) {
      headline.setCustomValidity('Поле обязательно к заполнению!');
    } else {
      headline.setCustomValidity('');
    }
  });

  // Валидация цены за ночь
  pricePerNight.addEventListener('input', function () {
    if (pricePerNight.validity.rangeOverflow) {
      pricePerNight.setCustomValidity('Не более 1 000 000 рублей');
    } else if (pricePerNight.validity.rangeUnderflow) {
      pricePerNight.setCustomValidity('Данные не корректны');
    } else if (pricePerNight.validity.valueMissing) {
      pricePerNight.setCustomValidity('Обязательно для заполнения. И только цифры!');
    } else {
      pricePerNight.setCustomValidity('');
    }
  });

  // Словарь соответствия типа жилья его цене
  var TypePrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  // Соответствие типа жилья с его ценой
  housingType.addEventListener('change', function () {
    var currentValue = housingType.value;
    var currentPrice = TypePrice[currentValue.toUpperCase()];
    pricePerNight.min = currentPrice;
    pricePerNight.placeholder = currentPrice;
  });

  // ФУНКЦИЯ синхронизирующая время заезда и выезда
  var checkTimeInOut = function (timeFirst, timeSecond) {
    timeSecond.value = timeFirst.value;
  };

  // СЛУШАТЕЛЬ времени заезда
  checkInTime.addEventListener('change', function () {
    checkTimeInOut(checkInTime, checkOutTime);
  });

  // СЛУШАТЕЛЬ времени выезда
  checkOutTime.addEventListener('change', function () {
    checkTimeInOut(checkOutTime, checkInTime);
  });

  window.adForm = {
    advertForm: advertForm,
    advertFormFieldsets: advertFormFieldsets,
    inputAddress: inputAddress,
    guestsAmount: guestsAmount
  };

})();
