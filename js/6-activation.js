'use strict';
// ТАК, ТЕБЯ ТО ТОЖЕ НАДО БЫ САМОВЫЗЫВАЮЩЕЙСЯ ИНКАПСУЛИРОВАНОЙ ФУНКЦИЕЙ СДЕЛАТЬ
// Бывший мэйн.джээс

// var COUNT_OF_ADVERT = 8; // Количество объявлений
// var FIELD_MIN_HEIGHT = 130; // Минимальная высота на карте
// var FIELD_MAX_HEIGHT = 630; // Максимальная высота на карте



// ПОКА ПРОДУБЛИРУЮ ИХ ЧИСТО ДЛЯ УДОБСТВА, НО ПОТОМ СУЙ ВСЁ В МОДУЛЬ (фильтрации)
var mapFiltersForm = document.querySelector('.map__filters'); // Форма с фильтрами
var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('.map__filter'); // Филдсеты формы фильтрации
var mapFiltersFormFeature = mapFiltersForm.querySelector('.map__features'); // Дополнительные удобства формы фильтрации

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
  putInactive(window.adForm.advertFormFieldsets, mapFiltersFormSelects, mapFiltersFormFeature, window.adForm.guestsAmount);
});

// ФУНКЦИЯ ПРИВОДЯЩАЯ ПРИЛОЖЕНИЕ В АКТИВНОЕ СОСТОЯНИЕ
// ХУЙНИ ПРОВЕРКУ, ЕСЛИ ДАННЫЕ ПРИШЛИ, ТО БОЛЬШЕ ПУСТЬ ЗАПРОС НЕ ПОСЫЛАЕТ. Или прямо в дампе. Ну кстати да, там логичнее. Прямо с неё и начинать.
var putActive = function (cards) {

  // Карта становится активной
  showMapElement('.map', 'map--faded');

  // Форма объявлений становится активной... почти (В ФУНКЦИЮ)
  window.adForm.advertForm.classList.remove('ad-form--disabled');

  for (var i = 0; i < window.adForm.advertFormFieldsets.length; i++) {
    window.adForm.advertFormFieldsets[i].removeAttribute('disabled');
  }

  // Форма фильтрации становится активной (В ФУНКЦИЮ)
  for (var j = 0; j < mapFiltersFormSelects.length; j++) {
    mapFiltersFormSelects[j].removeAttribute('disabled');
  }
  // И её блок с дополнительными удобствами
  mapFiltersFormFeature.removeAttribute('disabled');

  /*
  ОТСЮДА И ДО КОНЦА ДАННОЙ ФУНКЦИИ Я ПОНИМАЮ, ЧТО ЗНАТНУЮ ЕБАНИНУ СДЕЛАЛ,
  НО МНЕ БОЛЬНО УЖ ОХОТА ЗАКРЫТЬ МОДУЛЬ 7
  ЧИСТО ФОРМАЛЬНО ЗАДАНИЕ Я ВЫПОЛНИЛ,
  ТАК ЧТО ПУСТЬ ПОКА ТАК БУДЕТ, ПОТОМ БУДУ ЧИНИТЬ
  */

  // Полученные с сервера данные положил в переменную
  var advertItems = cards;
  // И отрисуем их все
  window.pin.insertTemplate(advertItems, window.pin.renderMapPinTemplate);

  // Функция для отображения не более 5 пинов
  var filtredNoMore5 = function (array) {
    window.pin.pinsKiller();
    var newArray = array.slice(0, 5);
    return newArray;
  };

  // Обрезаю массив до максимум 5
  advertItems = filtredNoMore5(advertItems);
  // Отрисовываю 5 элементов
  window.pin.insertTemplate(advertItems, window.pin.renderMapPinTemplate);

  // СЛУШАТЕЛЬ СОБЫТИЯ смены значения селекта НА ФОРМЕ (потому пока действует на все селекты)
  mapFiltersForm.addEventListener('change', function (evt) {
    if (evt.target.value === 'any') {
      advertItems = filtredNoMore5(advertItems);
      window.pin.insertTemplate(advertItems, window.pin.renderMapPinTemplate);
    } else {
      window.pin.pinsKiller();
      var filteredAdvertItems = cards
      .slice() // Слайс, наставник говорит, тоже лишний
      .filter(function (currentItem) {
        return currentItem.offer.type === evt.target.value;
      });
      filteredAdvertItems = filtredNoMore5(filteredAdvertItems);
      window.pin.insertTemplate(filteredAdvertItems, window.pin.renderMapPinTemplate);
    }
  });
  // Для пущей гибкости то, где сейчас тайп - так же должно быть переменной

  // Закрытие визитки хоткеем (ты нафига тут?)
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE && document.querySelector('.popup__close')) {
      window.util.map.removeChild(window.util.map.querySelector('.map__card'));
    }
  });

  

};

// СЛУШАТЕЛИ СОБЫТИЙ, приводящие карту в активное состояние
window.pin.mapPinMain.addEventListener('mousedown', function () {
  window.dump.load(window.dump.KEKSOBOOKING_UPLOAD_LINK, putActive, window.dump.logMessages);
});

window.pin.mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === window.util.ENTER_KEYCODE) {
    window.dump.load(window.dump.KEKSOBOOKING_UPLOAD_LINK, putActive, window.dump.logMessages);
  }
});



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


// ФУНКЦИЯ, приводящая нужные элементы в неактивное состояние
  // formAdvert для window.adForm.advertFormFieldsets
  // formFiltration для mapFiltersFormSelects
  // formFiltrationFeature для mapFiltersFormFeature
  // guestCount для window.adForm.guestsAmount
  // В ПРИНЦИПЕ МОЖНО ОПТИМИЗИРОВАТЬ И НАЙТИ ТОЛЬКО БАЗОВЫЕ ЭЛЕМЕНТЫ, А ПОТОМ УЖЕ ВНУТРИ ЧЕРЕЗ СЕЛЕКТОР БАЗОВОГО ЭЛЕМЕНТА ДОСТУЧАТЬСЯ ДО НУЖНОГО
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
  
    // Моя смекалка не знает границ (или "костыль для решения проблем с гостями")
    var guestsAmountOptions = guestCount.querySelectorAll('option');
      guestsAmountOptions.forEach(function (option) {
        option.disabled = true;
      });
      guestsAmountOptions[2].removeAttribute("disabled");
  
    // Призываю туман на карту
    hideMapElement('.map', 'map--faded');
  };


var refreshApp = function () {
  putInactive(window.adForm.advertFormFieldsets, mapFiltersFormSelects, mapFiltersFormFeature, window.adForm.guestsAmount); // Вызываю функцию деактивации приложения, КОТОРУЮ НАДО ДОПИЛИТЬ И ПЕРЕДЕЛАТЬ
  window.adForm.advertForm.reset(); // Сброс значений полей формы объявления
  window.adForm.advertForm.classList.add('ad-form--disabled'); // Затуманиваю форму объявления
  window.pin.mapPinMain.style.left = "570px" // Возвращаю главную метку в исходное положение по горизонтали
  window.pin.mapPinMain.style.top = "375px" // Возвращаю главную метку в исходное положение по вертикали
  window.adForm.inputAddress.value = (window.pin.mapPinMainX - Math.round(window.pin.mapPinMainWidth / 2)) + ', ' + (window.pin.mapPinMainY - Math.round(window.pin.mapPinMainHeight / 2) + 49); // Прописываю координаты метки в поле адреса
  window.pin.pinsKiller(); // Чищу другие пины
  window.util.map.removeChild(window.util.map.querySelector('.map__card')); // Удаляю карточку-визитку другого пина
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

// ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ
function onFormSubmit(evt) {
  evt.preventDefault();
  window.dump.sendFormData(window.adForm.advertForm, function () {
    document.body.querySelector('main').appendChild(successElement);
    document.body.addEventListener('click', onBodyClick);
    document.addEventListener('keydown', onEscPress);
    // resetPage();
  });
}

// Слушатель на форме объявления события отправки формы
window.adForm.advertForm.addEventListener('submit', onFormSubmit);

