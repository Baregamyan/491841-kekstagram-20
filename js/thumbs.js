'use strict';

(function () {

  var QUANTITY = 25;

  /**
   * Конструктор миниатюр фотографии.
   * @param {string} url - Адрес картинки.
   * @param {number} likes - Количество лайков.
   * @param {Array} comments - Комментарии.
   * @param {string} description - Описание.
   */
  function Thumb(url, likes, comments, description) {
    this.url = url;
    this.likes = likes;
    this.comments = comments;
    this.description = description;

  }

  /**
   * Возвращает HTML-шаблон миниатюры.
   * @return {HTMLElement}
   */
  Thumb.prototype.getNode = function () {
    this.template = document.querySelector('#picture').content.querySelector('a').cloneNode(true);
    this.template.querySelector('.picture__img').src = this.url;
    this.template.querySelector('.picture__likes').textContent = this.likes;
    this.template.querySelector('.picture__comments').textContent = this.comments.length;

    return this.template;
  };

  /**
   * Рендерит миниатюры.
   * @param {Array} data - Данные для миниатюр
   */
  Thumb.prototype.render = function (data) {
    this.data = data;
    this.container = document.querySelector('.pictures');
    this._fragment = document.createDocumentFragment();
    for (var i = 0; i < QUANTITY; i++) {
      this.thumb = new Thumb(this.data[i].url, this.data[i].likes, this.data[i].comments, this.data[i].description);
      this.thumbNode = this.thumb.getNode();
      this.thumbNode.addEventListener('click', this.thumb.onThumbClick.bind(this.thumb));
      this._fragment.appendChild(this.thumbNode);
    }
    this.container.appendChild(this._fragment);
  };

  /** Слушатель события нажатия на миниатюру */
  Thumb.prototype.onThumbClick = function () {
    var picture = new window.Picture(this.url, this.likes, this.comments, this.description);
    picture.show();
  };

  window.thumbs = {
    render: Thumb.prototype.render
  };
})();
