'use strict';

// Модуль по работе с данными с сервера

(function () {

  var Link = {
    KEKSOBOOKING_UPLOAD_LINK: 'https://js.dump.academy/keksobooking/data',
    KEKSOBOOKING_SEND_LINK: 'https://js.dump.academy/keksobooking'
  };

  var ServerResponseCode = {
    SUCCESS: 200,
    CACHED: 302,
    NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500
  };

  var DUMP_TIMEOUT = 10000; // В одной секунде - 1000 миллисекунд!

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorElement = errorTemplate.cloneNode(true);


  // ПОЛУЧЕНИЕ ДАННЫХ
  var load = function (url, onSuccess, onError) {
    var xhr = new XMLHttpRequest(); // Инициализировал объект
    xhr.responseType = 'json'; // Сказал в каком формате хочу данные
    xhr.timeout = DUMP_TIMEOUT; // Не дольше 10 секунд

    xhr.addEventListener('load', function () { // Если загрузка прошла успешно
      if (xhr.status === ServerResponseCode.SUCCESS) { // И статус ответа что надо
        onSuccess(xhr.response); // Верни данные
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText); // Иначе отобрази статус ответа и его текст
      }
    });

    xhr.addEventListener('error', function () { // Если в запросе произошла ошибка
      onError('Ошибка соединения'); // Сообщи об этом
    });

    xhr.addEventListener('timeout', function () { // Если заданный интервал превышен
      onError('Запрос не успел выполниться за ' + xhr.timeout / 1000 + ' сек.'); // Выдай ошибку и объясни в чём дело
    });

    // По идее эти 2 действия по порядку идут 2 и 3, но так правильнее
    xhr.open('GET', url); // Открываю соединение
    xhr.send(); // Посылаю запрос
  };


  // Сообщение об ошибке при загрузке данных с сервера
  var logMessages = function () {
    var errorTemplateElement = document.querySelector('#error').content.querySelector('.error');
    var mainBlock = document.querySelector('main');
    var templateMapPinElement = errorTemplateElement.cloneNode(true);
    mainBlock.appendChild(templateMapPinElement);
  };





  // ОТПРАВКА ДАННЫХ
  function sendFormData(adForm, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', Link.KEKSOBOOKING_SEND_LINK);
    xhr.send(new FormData(adForm));

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        callback();
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
  }

  function onBodyClick() {
    removeErrorPopup(errorElement);
  }

  function onEscPress(evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      removeErrorPopup(errorElement);
    }
  }

  function onError(message) {
    errorElement.querySelector('.error__message').textContent = message;
    document.body.querySelector('main').appendChild(errorElement);
    document.body.addEventListener('click', onBodyClick);
    document.addEventListener('keydown', onEscPress);
  }

  function removeErrorPopup(error) {
    document.body.querySelector('main').removeChild(error);
    document.body.removeEventListener('click', onBodyClick);
    document.removeEventListener('keydown', onEscPress);
  }


  window.dump = {
    KEKSOBOOKING_UPLOAD_LINK: Link.KEKSOBOOKING_UPLOAD_LINK,
    load: load,
    logMessages: logMessages,
    sendFormData: sendFormData
  };

})();
