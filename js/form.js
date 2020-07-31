'use strict';
(function () {

  /**
   * Конструктор формы загрузки своего изображения.
   * @constructor
   */
  function Form() {
    this.form = document.querySelector('.img-upload__form');
    this.container = this.form.querySelector('.img-upload__overlay');
  }

  /** Инициализация формы (добавление обработчиков). */
  Form.prototype.init = function () {
    this.onFormChange = this.show.bind(this);
    this.form.addEventListener('change', this.onFormChange);
  };

  /** Открытие формы. */
  Form.prototype.show = function () {
    this.close = this.form.querySelector('.img-upload__cancel');
    this.image = this.form.querySelector('.img-upload__preview').firstElementChild;

    this.container.classList.toggle('hidden', false);

    this.onKeyDown = this.keyDown.bind(this);
    this.onCloseClick = this.hide.bind(this);
    this.onFormSubmit = this.submit.bind(this);

    this.form.removeEventListener('change', this.onFormChange);
    this.form.addEventListener('submit', this.onFormSubmit);
    this.close.addEventListener('click', this.onCloseClick);
    document.addEventListener('keydown', this.onKeyDown);
    document.body.classList.toggle('modal-open', true);

    /** Инициализация интерактивных элементов формы */
    var scale = new window.Scale(this.form, this.image);
    var filter = new window.Filter(this.form, this.image, scale.setDefault.bind(scale));
    var pin = new window.Pin(this.form, filter.set.bind(filter));
    var validation = new window.Validation(this.form);

    this.scale = scale;
    this.filter = filter;
    this.pin = pin;
    this.validation = validation;

    scale.init();
    filter.init();
    pin.init();
    validation.init();

    this.set(scale, filter);
  };

  /**
   * Устанавливает фильтр и масштаб в значение по-умолчанию.
   * @param {Object} scale - Собранный конструктор масштаба фотографии.
   * @param {Object} filter - Собранный конструктор фильтра фотографии.
   */
  Form.prototype.set = function (scale, filter) {
    scale.setDefault();
    filter.set();
  };

  /**
   * Отрабатывание на нажатие клавиши закрытия при открытой форме.
   * @param {Object} evt - Объект события.
   */
  Form.prototype.keyDown = function (evt) {
    if (evt.keyCode === window.util.keycode.ESC) {
      this.hide();
    }
  };

  /** Скрытие формы. */
  Form.prototype.hide = function () {
    this.form.reset();
    this.scale.close();
    this.filter.close();
    this.validation.close();
    this.container.classList.toggle('hidden', true);
    this.form.removeEventListener('submit', this.onFormSubmit);
    this.form.addEventListener('change', this.onFormChange);
    this.close.removeEventListener('click', this.onCloseClick);
    document.removeEventListener('keydown', this.onKeyDown);
    document.body.classList.toggle('modal-open', false);
  };

  /** Отправка формы
   * @param {Object} evt - Объект события.
   */
  Form.prototype.submit = function (evt) {
    evt.preventDefault();
    var backend = new window.Backend();
    backend.post(new FormData(this.form));
    this.hide();
  };

  window.Form = Form;
})();
