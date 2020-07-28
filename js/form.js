'use strict';

/** Форма загрузки своего изображения */
(function () {
  /** Пре загрузки своего изображения */
  function Form() {
    this.form = document.querySelector('.img-upload__form');
    this.container = this.form.querySelector('.img-upload__overlay');
  }

  Form.prototype.init = function () {
    this.onFormChange = this.show.bind(this);
    this.form.addEventListener('change', this.onFormChange, false);
  };

  /** Открытие формы загрузки своей фотографии */
  Form.prototype.show = function () {
    this.close = this.form.querySelector('.img-upload__cancel');
    this.image = this.form.querySelector('.img-upload__preview').firstElementChild;

    this.container.classList.toggle('hidden', false);

    this.onKeyDown = this.keyDown.bind(this);
    this.onCloseClick = this.hide.bind(this);

    this.form.removeEventListener('change', this.onFormChange, false);
    this.close.addEventListener('click', this.onCloseClick, false);
    document.addEventListener('keydown', this.onKeyDown, false);

    var scale = new window.Scale(this.form, this.image);
    scale.init();
    var filter = new window.Filter(this.form, this.image, scale.setDefault.bind(scale));
    filter.init();
    var pin = new window.Pin(this.form, filter.set.bind(filter));
    pin.init();
    var validation = new window.Validation(this.form);
    validation.init();

    this.set(scale, filter);
  };

  Form.prototype.set = function (scale, filter) {
    scale.setDefault();
    filter.set();
  };

  Form.prototype.keyDown = function (evt) {
    if (evt.keyCode === window.util.keycode.ESC) {
      this.hide();
    }
  };

  Form.prototype.hide = function () {
    this.container.classList.toggle('hidden', true);
    this.form.addEventListener('change', this.onFormChange, false);
    this.close.removeEventListener('click', this.onCloseClick, false);
    this.form.reset();
    this.scale.close();
    this.filter.close();
    document.removeEventListener('keydown', this.onKeyDown, false);
  };

  window.Form = Form;
})();
