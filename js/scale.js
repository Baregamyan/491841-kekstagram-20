'use strict';
(function () {

  /** Конфиг для масштабирования. */
  var Config = {
    MIN: {VALUE: 25, TRANSFORM: 25},
    MAX: {VALUE: 100, TRANSFORM: 1},
    DEFAULT: {VALUE: 100, TRANSFORM: 1},
    STEP: 25
  };

  /**
   * Конструктор масштабирования изображения в форме.
   * @param {HTMLElement} form - HTML-элемент формы.
   * @param {HTMLElement} image - HTML-элемент изображения.
   */
  function Scale(form, image) {
    this.form = form;
    this.image = image;
    this.options = Config;
    this.step = this.options.STEP;
    this.min = {
      value: this.options.MIN.VALUE,
      transform: this.options.MIN.TRANSFORM
    };
    this.max = {
      value: this.options.MAX.VALUE,
      transform: this.options.MAX.TRANSFORM
    };
    this.default = {
      value: this.options.DEFAULT.VALUE,
      transform: this.options.DEFAULT.TRANSFORM
    };
  }
  /** Инициализация масштабирования (поиск основных элементов управления и навешивание обработчиков событий). */
  Scale.prototype.init = function () {
    this.bigger = this.form.querySelector('.scale__control--bigger');
    this.current = this.form.querySelector('.scale__control--value');
    this.smaller = this.form.querySelector('.scale__control--smaller');

    this.onBiggerClick = this.up.bind(this);
    this.onSmallerClick = this.down.bind(this);

    this.bigger.addEventListener('click', this.onBiggerClick);
    this.smaller.addEventListener('click', this.onSmallerClick);
  };

  /** Увеличение масштаба. */
  Scale.prototype.up = function () {
    var _size;
    var _currentValue = +this.current.value.slice(0, -1);
    if (_currentValue < (this.max.value - this.step)) {
      _size = Number(_currentValue += this.step);
      this._transformValue = '0.' + _size;
    } else {
      _size = this.max.value;
      this._transformValue = '1';
    }
    this.current.value = _size + '%';
    this.image.style = 'transform: scale(' + this._transformValue + ')';
  };

  /** Уменьшение масштаба. */
  Scale.prototype.down = function () {
    var _size;
    var _currentValue = +this.current.value.slice(0, -1);
    if (_currentValue > this.min.value) {
      _size = Number(_currentValue -= this.step);
    } else {
      _size = this.min.value;
    }
    this.current.value = _size + '%';
    this.image.style = 'transform: scale(0.' + _size + ')';
  };

  /** Установка масштаба по-умолчанию. */
  Scale.prototype.setDefault = function () {
    this.current.value = this.default.value + '%';
    this.image.style = 'transform: scale(' + this.default.transform + ')';
  };

  /** Отмена функционала масштабирования (происходит при закрытии формы). */
  Scale.prototype.close = function () {
    this.bigger.removeEventListener('click', this.onBiggerClick);
    this.smaller.removeEventListener('click', this.onSmallerClick);
  };

  window.Scale = Scale;
})();
