'use strict';

(function () {

  /** Конфиг к просмотру изображения. */
  var Config = {
    COMMENTS: {
      PER_LOAD: 5
    }
  };

  /**
   * Конструктор просмотра изображения.
   * @constructor
   * @param {string} url - Адрес изображения.
   * @param {number} likes - Количество лайков, поставленных изображению.
   * @param {Array} comments - Комментарии к изображению.
   * @param {string} description - Описание изображения.
   */
  function Picture(url, likes, comments, description) {
    this.url = url;
    this.likes = likes;
    this.comments = comments;
    this.description = description;
  }

  /** Показывает модальное окно с большой фотографией. */
  Picture.prototype.show = function () {
    this.template = document.querySelector('.big-picture');
    this.template.querySelector('.big-picture__img').firstElementChild.src = this.url;
    this.template.querySelector('.likes-count').textContent = this.likes;
    this.template.querySelector('.comments-count').textContent = this.comments.length;
    this.template.querySelector('.social__caption').textContent = this.description;
    this.template.classList.toggle('hidden', false);
    this.generateComments();

    this.onCloseClick = this.hide.bind(this);
    this.onKeyDown = this.keyDown.bind(this);
    this.template.querySelector('#picture-cancel').addEventListener('click', this.onCloseClick, false);
    document.addEventListener('keydown', this.onKeyDown, false);
    document.body.classList.toggle('modal-open', true);
  };

  /** Генерирует комментарии. */
  Picture.prototype.generateComments = function () {
    this.list = this.template.querySelector('.social__comments');
    this.list.textContent = '';
    this.moreButton = this.template.querySelector('.comments-loader');
    this.onMoreButtonClick = this.loadComments.bind(this);
    this.moreButton.addEventListener('click', this.onMoreButtonClick, false);
    if (this.comments.length > 0) {
      this.loadComments();
      this.template.querySelector('.social__comment-count').classList.toggle('hidden', false);
    } else {
      this.moreButton.classList.toggle('hidden', true);
      this.empty = document.createElement('p');
      this.empty.textContent = 'ПОКА ЕЩЁ НИКТО НЕ ОСТАВИЛ КОММЕНТАРИЯ';
      this.empty.style = 'text-align: center';
      this.list.appendChild(this.empty);
      this.template.querySelector('.social__comment-count').classList.toggle('hidden', true);
    }
  };

  /**
   * Слушатель нажатия на клавиатуру при открытом окне с фотографией.
   * @param {Object} evt - Объект события.
   */
  Picture.prototype.keyDown = function (evt) {
    if (evt.keyCode === window.util.keycode.ESC) {
      this.hide();
    }
  };

  /** Загружает комментарии. */
  Picture.prototype.loadComments = function () {
    this.update();
    var _step = this.unloaded >= Config.COMMENTS.PER_LOAD ? Config.COMMENTS.PER_LOAD : this.unloaded;
    this.moreButton.classList.toggle('hidden', false);
    while (_step) {
      var currentComment = this.getComment(this.comments[this.total - this.unloaded]);
      this.list.appendChild(currentComment);
      this.update();
      this.template.querySelector('.social__comment-count').firstChild.textContent = this.loaded + ' из ';
      _step--;
    }
    if (this.total === this.loaded) {
      this.moreButton.classList.toggle('hidden', true);
    }
  };

  /** Обновляет состояние комментариев: количество уже загруженных, незагруженных и общее количество. */
  Picture.prototype.update = function () {
    this.loaded = this.list.childElementCount;
    this.unloaded = this.comments.length - this.list.childElementCount;
    this.total = this.comments.length;
  };

  /** Прячет модальное окно с большой фотографией */
  Picture.prototype.hide = function () {
    this.template.classList.toggle('hidden', true);
    this.list.textContent = '';
    this.moreButton.removeEventListener('click', this.onMoreButtonClick, false);
    document.removeEventListener('keydown', this.onKeyDown, false);
    document.body.classList.toggle('modal-open', false);
  };

  /**
   * Возвращает сгенерированный комментарий в HTML.
   * @param {Object} options - Параметры комментария.
   * @param {string} options.avatar - Адрес к иконке с аватаром автора комментария.
   * @param {string} options.name - Имя автора комментария.
   * @param {string} options.message - Текст комментария.
   * @return {HTMLElement}
   */
  Picture.prototype.getComment = function (options) {
    this.src = options.avatar;
    this.alt = options.name;
    this.weight = '35';
    this.height = '35';
    this.message = options.message;

    this.comment = document.createElement('li');
    this.comment.setAttribute('class', 'social__comment');

    this.text = document.createElement('p');
    this.text.setAttribute('class', 'social__text');
    this.text.textContent = this.message;

    this.avatar = document.createElement('img');
    this.Attributes = {class: 'social__picture', src: this.src, alt: this.alt, weight: this.weight, height: this.height};
    for (var key in this.Attributes) {
      if (this.Attributes.hasOwnProperty(key)) {
        this.avatar.setAttribute(key, this.Attributes[key]);
      }
    }
    this.comment.appendChild(this.avatar);
    this.comment.appendChild(this.text);

    return this.comment;
  };

  window.Picture = Picture;
})();
