'use strict';

(function () {
  window.load = function (url, onSuccess, onError) {
    var xhr = new XMLHttpRequest(); // Инициализировал объект

    xhr.responseType = 'json'; // Сообщаю браузеру, в каком формате мне нужен результат
    
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) { //Если проблем нет
        onSuccess(xhr.response); // Тогда верни результат
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText); //Иначе - вот такая у нас проблемка
      }
    });

    // Если проблемы с соединением
    xhr.addEventListener('error', function () {
      onError('Ошибка соединения, бротан');
    });
    
    // Если интервал ожидания превышен
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    
    // Интервал ожидания. СУНУТЬ В КОНСТАНТУ. Все прочие известные заранее данные, кстати, тоже.
    xhr.timeout = 10000; // 10s
    
    xhr.open('GET', url); //Открою соединение вот по этому адресу: https://js.dump.academy/keksobooking/data
    xhr.send(); //И пошлю туда запрос
    
  }
})();