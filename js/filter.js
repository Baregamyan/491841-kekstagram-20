'use strict';

(function () {

  var Config = {
    CHROME: {MIN: 0, MAX: 1, NAME: 'grayscale', VALUE_TYPE: 'integer'},
    SEPIA: {MIN: 0, MAX: 1, NAME: 'sepia', VALUE_TYPE: 'integer'},
    MARVIN: {MIN: 0, MAX: 100, NAME: 'invert', VALUE_TYPE: 'percent'},
    PHOBOS: {MIN: 0, MAX: 3, NAME: 'blur', VALUE_TYPE: 'pixels'},
    HEAT: {MIN: 1, MAX: 3, NAME: 'brightness', VALUE_TYPE: 'integer'}
  };

  function Filter(form, image, scaleDefault) {
    this.form = form;
    this.image = image;
    this.scaleDefault = scaleDefault;
    this.config = Config;
  }

  Filter.prototype.init = function () {
    this.filters = this.form.querySelectorAll('.effects__radio');
    this.pinContainer = this.form.querySelector('.effect-level');
    this.pin = this.pinContainer.querySelector('.effect-level__pin');

    this.onFilterClick = this.filterClick.bind(this);

    for (var i = 0; i < this.filters.length; i++) {
      var _filter = this.filters[i];
      _filter.addEventListener('click', this.onFilterClick, false);
    }
  };

  Filter.prototype.set = function (isDefault) {
    var current = this.getCurrent();
    if (current === 'NONE') {
      this.pinContainer.classList.toggle('hidden', true);
      this.image.style = '';
    } else {
      this.pinContainer.classList.toggle('hidden', false);
      if (isDefault) {
        this.pin.style.left = this.pin.parentElement.offsetWidth + 'px';
        this.pin.nextElementSibling.style.width = '100%';
      }
      this.image.style = this.getStyle(current);
    }
  };

  Filter.prototype.filterClick = function () {
    this.scaleDefault();
    this.set(true);
  };

  Filter.prototype.getCurrent = function () {
    return this.form.querySelector('.effects__radio:checked').value.toUpperCase();
  };

  Filter.prototype.getStyle = function (current) {
    var config = this.config[current];
    var _style = config.NAME;
    var _level = this.getLevel(config);
    return 'filter:' + _style + '(' + _level + ')';
  };

  Filter.prototype.getLevel = function (options) {
    this.options = options;
    this.type = this.options.VALUE_TYPE;
    this.min = this.options.MIN;
    this.max = this.options.MAX;
    this.pinPosition = this.pin.offsetLeft;
    this.parentPinWidth = this.pin.parentElement.offsetWidth;
    this.percentPinPosition = window.util.culcPercent(this.pinPosition, this.parentPinWidth);
    switch (this.type) {
      case 'percent':
        return this.percentPinPosition + '%';
      case 'pixels':
        return window.util.culcPercentToNumber(this.percentPinPosition, this.min, this.max) + 'px';
      default:
        return window.util.culcPercentToNumber(this.percentPinPosition, this.min, this.max);
    }
  };

  Filter.prototype.close = function () {
    for (var i = 0; i < this.filters.length; i++) {
      var _filter = this.filters[i];
      _filter.removeEventListener('click', this.onFilterClick, false);
    }
  };

  window.Filter = Filter;
})();
