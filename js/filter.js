'use strict';

// Модуль фильтрации

(function () {

var mapFiltersForm = document.querySelector('.map__filters'); // Форма с фильтрами
var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('.map__filter'); // Филдсеты формы фильтрации
var mapFiltersFormFeature = mapFiltersForm.querySelector('.map__features'); // Дополнительные удобства формы фильтрации


  window.filter = {
    mapFiltersForm: mapFiltersForm,
    mapFiltersFormSelects: mapFiltersFormSelects,
    mapFiltersFormFeature: mapFiltersFormFeature
  };
  
  })();