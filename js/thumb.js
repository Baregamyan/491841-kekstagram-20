'use strict';
(function () {

  /**
   * Конструктор миниатюр фотографии.
   * @constructor
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

  /** Слушатель события нажатия на миниатюру. */
  Thumb.prototype.onThumbClick = function () {
    var picture = new window.Picture(this.url, this.likes, this.comments, this.description);
    picture.show();
  };

  window.Thumb = Thumb;
})();
