'use strict';

// Модуль карточек-визиток для других пинов

(function () {

  var offerTypes = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  // Забрал шаблон для визиток
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  // Функция отрисовки визиток
  function renderAdvertisementCard(advertisement) {
    var card = cardTemplate.cloneNode(true);
    card.querySelector('.popup__title').textContent = advertisement.offer.title;
    card.querySelector('.popup__text--address').textContent = advertisement.offer.address;
    card.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = offerTypes[advertisement.offer.type];
    card.querySelector('.popup__text--capacity').textContent =
      advertisement.offer.rooms + ' комнаты для ' + advertisement.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent =
      'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;

    // Дополнительные удобства
    var featuresPopup = card.querySelector('.popup__features');
    featuresPopup.textContent = '';

    // Фрагмент с удобствами
    var featureFragment = document.createDocumentFragment();
    advertisement.offer.features.forEach(function (featureName) {
      var feature = document.createElement('li');
      feature.classList.add('popup__feature', 'popup__feature--' + featureName);
      featureFragment.appendChild(feature);
    });
    featuresPopup.appendChild(featureFragment);

    // Фрагмент с превьюшками фото
    var photosFragment = document.createDocumentFragment();
    advertisement.offer.photos.forEach(function (photo) {
      var photoElement = card.querySelector('.popup__photo').cloneNode(false);
      photoElement.src = photo;
      photosFragment.appendChild(photoElement);
    });

    // Оставшиеся значения
    card.querySelector('.popup__description').textContent = advertisement.offer.description;
    card.querySelector('.popup__photos').textContent = '';
    card.querySelector('.popup__photos').appendChild(photosFragment);
    card.querySelector('.popup__avatar').src = advertisement.author.avatar;

    // Обработчик закрытия карточки
    card.querySelector('.popup__close').addEventListener('click', function () {
      window.util.map.removeChild(window.util.map.querySelector('.map__card'));
      deleteActiveSign(document.querySelector('.map__pins'));
    });

    // Закрытие визитки хоткеем
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.util.ESC_KEYCODE && document.querySelector('.popup__close')) {
        window.util.map.removeChild(window.util.map.querySelector('.map__card'));
        deleteActiveSign(document.querySelector('.map__pins'));
      }
    });

    return card;
  }

  // Функция, удаляющая признак активности у других меток
  var deleteActiveSign = function (pinSimilar) {
    for (var i = 0; i < pinSimilar.children.length; i++) {
      pinSimilar.children[i].classList.remove('map__pin--active');
    }
  };

  window.cutaway = {
    renderAdvertisementCard: renderAdvertisementCard,
    deleteActiveSign: deleteActiveSign
  };
})();
