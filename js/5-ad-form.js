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
    // Получаем коллекцию вариантов выбора селекта гостей
    var guestsAmountOptions = guestsAmount.querySelectorAll('option');

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
      headline.setCustomValidity('Минимум 30 символов!');
    } else if (headline.validity.tooLong) {
      headline.setCustomValidity('Максимум 100 символов!'); // Секретное сообщение =)
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




// УДАЛИ, КОГДА УБЕДИШЬСЯ, ЧТО ВСЁ РАБОТАЕТ
/*

  // ОТСЮДА И НИЖЕ - всё, что касается отправки формы на сервер

  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successElement = successTemplate.cloneNode(true);

  function removeSuccessPopup(element) {
    if (element) {
      document.body.querySelector('main').removeChild(element);
      document.body.removeEventListener('click', onBodyClick);
      document.removeEventListener('keydown', onEscPress);
    }
  }

  var refreshApp = function () {
    advertForm.reset(); // Вернул все поля формы к дефолту... кроме адреса >_<
    // СНАЧАЛА КООРДИНАТЫ МЕТКИ ВЕРНУТЬ В ИСХОДНУЮ ТОЧКУ
    inputAddress.value = (window.pin.mapPinMainX - Math.round(window.pin.mapPinMainWidth / 2)) + ', ' + (window.pin.mapPinMainY - Math.round(window.pin.mapPinMainHeight / 2) + 49);
    window.pin.pinsKiller();
    // ... Ага, хуй. Короче надо актив и инактив разбить на 2 модуля и актив сделать самым нижним, а инактив разместить над... или... функцию инактива описать... бля, стоп... Она использует данные из адформ и фильтров.
    // А вызываться должна в адформе... незадача... В принципе можно же описать её в утиле, вызывать в активэйшине (ну там её так и так надо вызывать)... а что в адформе и фильтрах нужное - передавать ей как аргументы. Ну да... вполне себе решение.
    // И из пинов ещё будет пин-киллер... хотя... можно так же его отдельно вызывать только здесь, там-то он не нужен.
  }

  function onBodyClick() {
    removeSuccessPopup(successElement);
    refreshApp();
  }

  function onEscPress(evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      removeSuccessPopup(successElement);
      refreshApp();
    }
  }

  // function removeImagesFromForm() {
  //   avatarPreview.querySelector('img').src = 'img/muffin-grey.svg';
  //   apartmentPhotoPreview.textContent = '';
  // }

  // function resetPage() {
  //   removeImagesFromForm();
  //   adForm.reset();
  //   document.querySelector('.map').classList.add('map--faded');
  //   adForm.classList.add('ad-form--disabled');
  //   pins.textContent = '';
  //   mainPin.style.left = MAIN_PIN_X_INITIAL + 'px';
  //   mainPin.style.top = MAIN_PIN_Y_INITIAL + 'px';
  //
  //   pins.appendChild(mainPin);
  //   window.map.setAddress(parseInt(mainPin.style.left, 10), parseInt(mainPin.style.top, 10));
  //   var mapCard = document.querySelector('.map__card');
  //   if (mapCard) {
  //     document.querySelector('.map').removeChild(mapCard);
  //   }
  //   mainPin.addEventListener('click', window.map.activatePage);
  // }

  // advertForm.addEventListener('reset', function () {
  //   removeImagesFromForm();
  // });

  // ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ

  function onFormSubmit(evt) {
    evt.preventDefault();
    window.dump.sendFormData(advertForm, function () {
      document.body.querySelector('main').appendChild(successElement);
      document.body.addEventListener('click', onBodyClick);
      document.addEventListener('keydown', onEscPress);
      // resetPage();
    });
  }

  advertForm.addEventListener('submit', onFormSubmit);


*/


  window.adForm = {
    advertForm: advertForm,
    advertFormFieldsets: advertFormFieldsets,
    inputAddress: inputAddress,
    guestsAmount: guestsAmount
  };

})();
