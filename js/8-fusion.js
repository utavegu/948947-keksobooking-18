'use strict';

// Модуль, соединяющие воедино всё, что в него стекается и активирующий/деактивирующий приложение
// Бывший активэйши.джээс более бывший мэйн.джээс

(function () {

  // ФУНКЦИЯ, показывающая карту
  var showMapElement = function (desiredSelector, deletedClass) {
    var mapElement = document.querySelector(desiredSelector);
    mapElement.classList.remove(deletedClass);
  };

  // ФУНКЦИЯ, скрывающая карту
  var hideMapElement = function (addedSelector, addedClass) {
    var mapElement = document.querySelector(addedSelector);
    mapElement.classList.add(addedClass);
  };

  // СЛУШАТЕЛЬ СОБЫТИЙ, приводящий страницу в неактивное состояние
  document.addEventListener('DOMContentLoaded', function () {
    putInactive(window.adForm.advertFormFieldsets, window.filter.mapFiltersFormSelects, window.filter.mapFiltersFormFeature, window.adForm.guestsAmount);
  });

  // ФУНКЦИЯ ПРИВОДЯЩАЯ ПРИЛОЖЕНИЕ В АКТИВНОЕ СОСТОЯНИЕ
  var putActive = function (cards) {

    // Карта становится активной
    showMapElement('.map', 'map--faded');

    // Форма объявлений становится активной
    window.adForm.advertForm.classList.remove('ad-form--disabled');

    for (var i = 0; i < window.adForm.advertFormFieldsets.length; i++) {
      window.adForm.advertFormFieldsets[i].removeAttribute('disabled');
    }

    // Форма фильтрации становится активной
    for (var j = 0; j < window.filter.mapFiltersFormSelects.length; j++) {
      window.filter.mapFiltersFormSelects[j].removeAttribute('disabled');
    }
    // И её блок с дополнительными удобствами
    window.filter.mapFiltersFormFeature.removeAttribute('disabled');

    // Удаляю слушатель клика на главной метке
    window.pin.mapPinMain.removeEventListener('mousedown', start);

    // Полученные с сервера данные положил в переменную
    var advertItems = cards;
    // И отрисуем их
    window.pin.insertTemplate(advertItems.slice(0, window.filter.SHOW_MAX_ADS), window.pin.renderMapPinTemplate);

    // Слушаю на форме фильтрации события смены селектов
    window.filter.mapFiltersForm.addEventListener('change', window.debounce(function () {
      if (document.querySelector('.popup__close')) {
        window.util.map.removeChild(window.util.map.querySelector('.map__card'));
      } // Чищу визитки
      window.pin.pinsKiller(); // И чужие пины
      window.pin.insertTemplate(window.filter.multyfilter(advertItems), window.pin.renderMapPinTemplate); // Отрисовываю
    }));

    // Закрытие визитки хоткеем
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE && document.querySelector('.popup__close')) {
        window.util.map.removeChild(window.util.map.querySelector('.map__card'));
      }
    });

  };

  // Для удаления обработчика
  var start = function () {
    window.dump.load(window.dump.KEKSOBOOKING_UPLOAD_LINK, putActive, window.dump.logMessages);
  };

  // СЛУШАТЕЛИ СОБЫТИЙ, приводящие карту в активное состояние
  window.pin.mapPinMain.addEventListener('mousedown', start);

  window.pin.mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE) {
      start();
    }
  });

  // Шаблон уведомления об успешной отправке формы на сервер
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successElement = successTemplate.cloneNode(true);

  // Удаление уведомления об успешной отправке формы
  function removeSuccessPopup(element) {
    if (element) {
      document.body.querySelector('main').removeChild(element);
      document.body.removeEventListener('click', onBodyClick);
      document.removeEventListener('keydown', onEscPress);
    }
  }

  var putInactive = function (formAdvert, formFiltration, formFiltrationFeature, guestCount) {
    // Заблокировать форму объявления
    for (var i = 0; i < formAdvert.length; i++) {
      formAdvert[i].setAttribute('disabled', 'disabled');
    }
    // Заблокировать форму фильтрации
    for (var j = 0; j < formFiltration.length; j++) {
      formFiltration[j].disabled = 'disabled';
    }
    // И её блок с удобствами
    formFiltrationFeature.disabled = 'disabled';

    // Костыль для решения проблем с гостями
    var guestsAmountOptions = guestCount.querySelectorAll('option');
    guestsAmountOptions.forEach(function (option) {
      option.disabled = true;
    });
    guestsAmountOptions[2].removeAttribute('disabled');

    // Призываю туман на карту
    hideMapElement('.map', 'map--faded');
  };

  // ФУНКЦИЯ, делающая все дела после успешной отправки формы и закрытия попапа
  var refreshApp = function () {
    putInactive(window.adForm.advertFormFieldsets, window.filter.mapFiltersFormSelects, window.filter.mapFiltersFormFeature, window.adForm.guestsAmount); // Вызываю функцию деактивации приложения
    window.adForm.advertForm.reset(); // Сброс значений полей формы объявления
    window.filter.mapFiltersForm.reset(); // Сброс значений полей формы фильтрации
    window.adForm.advertForm.classList.add('ad-form--disabled'); // Затуманиваю форму объявления
    window.pin.mapPinMain.style.left = '570px'; // Возвращаю главную метку в исходное положение по горизонтали
    window.pin.mapPinMain.style.top = '375px'; // Возвращаю главную метку в исходное положение по вертикали
    window.adForm.inputAddress.value = (window.pin.mapPinMainX - Math.round(window.pin.mapPinMainWidth / 2)) + ', ' + (window.pin.mapPinMainY - Math.round(window.pin.mapPinMainHeight / 2) + 49); // Прописываю НАЧАЛЬНЫЕ координаты метки в поле адреса
    window.pin.pinsKiller(); // Чищу другие пины
    if (document.querySelector('.popup__close')) {
      window.util.map.removeChild(window.util.map.querySelector('.map__card'));
    } // Удаляю карточку-визитку другого пина
    window.pin.mapPinMain.addEventListener('mousedown', start); // Возвращаю обработчик клика по главной метке
  };

  // Обработчик для закрытия окна об успешной подаче объявления (при клике в любом месте)
  function onBodyClick() {
    removeSuccessPopup(successElement);
    refreshApp();
  }

  // Аналонично, но на эскейп
  function onEscPress(evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      removeSuccessPopup(successElement);
      refreshApp();
    }
  }

  // ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ
  function onFormSubmit(evt) {
    evt.preventDefault();
    window.dump.sendFormData(window.adForm.advertForm, function () {
      document.body.querySelector('main').appendChild(successElement);
      document.body.addEventListener('click', onBodyClick);
      document.addEventListener('keydown', onEscPress);
    });
  }

  // Слушатель на форме объявления события отправки формы
  window.adForm.advertForm.addEventListener('submit', onFormSubmit);

  // Функция для очистки полей формы подачи объявления
  function onFormReset(evt) {
    evt.preventDefault();
    window.adForm.advertForm.reset();
    window.adForm.inputAddress.value = window.superCrutch;
  }

  // Слушатель на форме объявления события очистки полей
  var resetButton = window.adForm.advertForm.querySelector('.ad-form__reset');
  resetButton.addEventListener('click', onFormReset);

})();
