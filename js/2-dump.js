'use strict';

// Модуль по работе с данными с сервера

(function () {

  var DUMP_TIMEOUT = 10000; // В одной секунде - 1000 миллисекунд!

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

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorElement = errorTemplate.cloneNode(true);

  // ПОЛУЧЕНИЕ ДАННЫХ
  var load = function (url, onSuccess, onErrorArg) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = DUMP_TIMEOUT;
    xhr.addEventListener('load', function () {
      if (xhr.status === ServerResponseCode.SUCCESS) {
        onSuccess(xhr.response);
      } else {
        onErrorArg('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout / 1000 + ' сек.');
    });
    xhr.open('GET', url);
    xhr.send();
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
    xhr.timeout = DUMP_TIMEOUT;
    xhr.open('POST', Link.KEKSOBOOKING_SEND_LINK);
    xhr.send(new FormData(adForm));

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        callback();
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения!');
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышено время ожидания в ' + xhr.timeout + 'мс');
    });

  }

  // Обработчик удаления окна об ошибке при клике на любой точке экрана
  function onBodyClick() {
    removeErrorPopup(errorElement);
  }

  // Аналогично, но при нажатии эскейпа
  function onEscPress(evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE) {
      removeErrorPopup(errorElement);
    }
  }

  // Сообщение об ошибке
  function onError(message) {
    errorElement.querySelector('.error__message').textContent = message;
    document.body.querySelector('main').appendChild(errorElement);
    document.body.addEventListener('click', onBodyClick);
    document.addEventListener('keydown', onEscPress);
  }

  // Удаление окна об ошибке
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
