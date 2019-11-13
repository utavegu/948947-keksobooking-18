'use strict';

// Модуль формы объявления

(function () {

  var advertForm = document.querySelector('.ad-form'); // Форма заполнения информации об объявлении
  var advertFormFieldsets = advertForm.querySelectorAll('fieldset'); // Филдсеты формы объявления

  // Поле адреса формы подачи объявления
  var inputAddress = advertForm.querySelector('#address');
  // Координаты, куда указывает метка, когда страница в неактивном состоянии (передаю это значение в поле адреса)
  inputAddress.value = (window.pin.mapPinMainX - Math.round(window.pin.mapPinMainWidth / 2)) + ', ' + (window.pin.mapPinMainY - Math.round(window.pin.mapPinMainHeight / 2));


  // Поля формы подачи объявления
  var headline = advertForm.querySelector('#title'); // Заголовок объявления
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
    // Получаем коллекцию вариантов выбора селекта гостей
    var guestsAmountOptions = guestsAmount.querySelectorAll('option');
    guestsAmount.removeAttribute('disabled'); // Так-то бы подсказку повесить, почему он не работает

    // Задизабливаем каждый пункт
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
      headline.setCustomValidity('Слишком коротко, пёс!');
    } else if (headline.validity.tooLong) {
      headline.setCustomValidity('Длинновато для такого пса, как ты!'); // Секретное сообщение =)
    } else if (headline.validity.valueMissing) {
      headline.setCustomValidity('Заполни поле, ты, пёс!');
    } else {
      headline.setCustomValidity('');
    }
  });


  // Валидация цены за ночь (обойдёмся без псов, для разнообразия)
  pricePerNight.addEventListener('input', function () {
    if (pricePerNight.validity.rangeOverflow) {
      pricePerNight.setCustomValidity('Не более 1 000 000 рублей');
    } else if (pricePerNight.validity.rangeUnderflow) {
      pricePerNight.setCustomValidity('Не менее 0 рублей');
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
    // pricePerNight.value = currentPrice; // При условии, если там уже не пусто, добавь. Либо очищай. А, отбой, не надо по ТЗ.
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
  };

})();
