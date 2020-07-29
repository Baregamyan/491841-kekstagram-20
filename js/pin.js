'use strict';
(function () {

  /**
   * Конструктор пина регулировки уровня насыщенности фильтра.
   * @constructor
   * @param {HTMLElement} form - Форма загрузки своего изображения
   * @param {Object} filterSet - Метод установки насыщенности фильтра.
   */
  function Pin(form, filterSet) {
    this.form = form;
    this.filterSet = filterSet;
    this.pin = this.form.querySelector('.effect-level__pin');
    this.depth = this.form.querySelector('.effect-level__depth');
    this.position = {
      min: 0,
      max: this.pin.parentElement.offsetWidth
    };
  }

  /** Инициализация пина (навешивание обработчиков событий) */
  Pin.prototype.init = function () {
    this.onPinMousedown = this.mouseDown.bind(this);
    this.pin.addEventListener('mousedown', this.onPinMousedown, false);
  };

  /**
   * Событие нажатия на мышь (тачпада или др.). Начинает движение пина.
   * @param {Object} evt - Объект события.
   */
  Pin.prototype.mouseDown = function (evt) {
    evt.preventDefault();

    this.coords = {
      x: evt.clientX
    };

    this.onMouseMove = this.mousemove.bind(this);
    this.onMouseUp = this.mouseup.bind(this);

    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
  };

  /**
   * Событие движения мыши (тачпада или др.). Двигает пин за курсором.
   * @param {Object} evt - Объект события.
   */
  Pin.prototype.mousemove = function (evt) {
    evt.preventDefault();
    this.position.current = this.pin.offsetLeft;
    this.position.shift = {
      x: this.coords.x - evt.clientX
    };
    var _position = this.position.current - this.position.shift.x;

    if (_position < 0) {
      _position = 0;
    } else if (_position > this.position.max) {
      _position = this.position.max;
    } else {
      this.pin.style.left = (_position) + 'px';
      this.depth.style.width = window.util.culcPercent(_position, this.position.max) + '%';
    }

    this.filterSet(false);

    this.coords = {
      x: evt.clientX
    };
  };

  /**
   * Событие отпускания кнопки мыши (тачпада или др.). Заканчивает движение пина.
   * @param {Object} evt - Объект события.
   */
  Pin.prototype.mouseup = function (evt) {
    evt.preventDefault();
    this.dragged = false;
    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);
  };

  window.Pin = Pin;
})();
