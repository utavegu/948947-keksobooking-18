'use strict';

// Модуль фильтрации

(function () {

  var SHOW_MAX_ADS = 5; // Лимит отображаемых объявлений

  var mapFiltersForm = document.querySelector('.map__filters'); // Форма с фильтрами
  var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('.map__filter'); // Филдсеты формы фильтрации
  var mapFiltersFormFeature = mapFiltersForm.querySelector('.map__features'); // Дополнительные удобства формы фильтрации

  var housingType = mapFiltersForm.querySelector('#housing-type'); // Выбор типа жилья
  var housingPrice = mapFiltersForm.querySelector('#housing-price'); // Выбор цены
  var housingRooms = mapFiltersForm.querySelector('#housing-rooms'); // Выбор количества комнат
  var housingGuests = mapFiltersForm.querySelector('#housing-guests'); // Выбор количества гостей
  var housingFeatures = mapFiltersForm.querySelector('#housing-features'); // Блок дополнительных удобств

  // Соответствия для поля цены
  var Price = {
    Type: {
      LOW: 'low',
      MIDDLE: 'middle',
      HIGH: 'high'
    },
    Value: {
      MIN: 10000,
      MAX: 50000
    }
  };

  // Фильтр по ТИПУ ЖИЛЬЯ
  function filterHousingType(element) {
    return housingType.value === 'any' ? true : element.offer.type === housingType.value;
  }

  // Фильтр по ЦЕНЕ
  function filterHousingPrice(element) {
    switch (housingPrice.value) {
      case Price.Type.LOW:
        return element.offer.price < Price.Value.MIN;
      case Price.Type.MIDDLE:
        return element.offer.price >= Price.Value.MIN && element.offer.price <= Price.Value.MAX;
      case Price.Type.HIGH:
        return element.offer.price >= Price.Value.MAX;
      default:
        return true;
    }
  }

  // Фильтр по КОЛИЧЕСТВУ КОМНАТ
  function filterHousingRooms(element) {
    return housingRooms.value === 'any' ? true : element.offer.rooms === Number(housingRooms.value);
  }

  // Фильтр по ЧИСЛУ ГОСТЕЙ
  function filterHousingGuests(element) {
    return housingGuests.value === 'any' ? true : element.offer.guests === Number(housingGuests.value);
  }

  // Фильтр по ДОПОЛНИТЕЛЬНЫМ УДОБСТВАМ
  function filterHousingFeatures(element) {
    return Array.from(housingFeatures.children)
      .filter(function (feature) {
        return feature.checked === true;
      })
      .map(function (item) {
        return item.value;
      })
      .every(function (feature) {
        return element.offer.features.includes(feature);
      });
  }

  // ФУНКЦИЯ, объединяющая работу всех фильров и ограничивающая результат 5-ю объявлениями
  function multyfilter(data) {
    return data
      .filter(function (element) {
        return (
          filterHousingType(element) &&
          filterHousingPrice(element) &&
          filterHousingRooms(element) &&
          filterHousingGuests(element) &&
          filterHousingFeatures(element)
        );
      })
      .slice(0, SHOW_MAX_ADS);
  }


  window.filter = {
    mapFiltersForm: mapFiltersForm,
    mapFiltersFormSelects: mapFiltersFormSelects,
    mapFiltersFormFeature: mapFiltersFormFeature,
    multyfilter: multyfilter,
    SHOW_MAX_ADS: SHOW_MAX_ADS
  };

})();
