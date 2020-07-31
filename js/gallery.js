'use strict';
(function () {

  /** Конфиг галереи */
  var Config = {
    Quantity: {
      DEFAULT: 25,
      RANDOM: 10
    }
  };

  /**
   * Конструктор галереи
   * @constructor
   * @param {Array} data - Данные изображенийю
   */
  function Gallery(data) {
    this.data = data;
    this.config = Config;
    this.container = document.querySelector('.pictures');
    this.init();
  }

  /** Рендерит изображения
   * @param {Array} data - Данные изображений.
   */
  Gallery.prototype.render = function (data) {
    this.data = data || this.data;
    this.clear();
    var _fragment = document.createDocumentFragment();
    for (var i = 0; i < this.data.length; i++) {
      var thumb = new window.Thumb(this.data[i].url, this.data[i].likes, this.data[i].comments, this.data[i].description);
      var thumbNode = thumb.getNode();
      thumbNode.addEventListener('click', thumb.onThumbClick.bind(thumb));
      _fragment.appendChild(thumbNode);
    }
    this.container.appendChild(_fragment);
  };

  /** Инициирует галерею */
  Gallery.prototype.init = function () {
    this.filters = document.querySelector('.img-filters');
    this.sortButtons = this.filters.querySelectorAll('.img-filters__button');

    this.filters.classList.toggle('img-filters--inactive', false);
    this.currentButton = this.filters.querySelector('.img-filters__button--active');

    for (var i = 0; i < this.sortButtons.length; i++) {
      var _button = this.sortButtons[i];
      this.onSortButtonClick = this.sort.bind(this, _button);
      _button.addEventListener('click', this.onSortButtonClick);
    }
  };

  /** Сортировка данных изображений
   * @param {HTMLElement} current - Активная кнопка сортировки изображений.
   */
  Gallery.prototype.sort = function (current) {
    this.currentButton.classList.toggle('img-filters__button--active', false);
    this.currentButton = current;
    this.currentButton.classList.toggle('img-filters__button--active', true);

    var _sort = current.id;

    switch (_sort) {
      case 'filter-random':
        this.render(this.randomizeData());
        break;
      case 'filter-discussed':
        this.render(this.filterizeData());
        break;
      default:
        var backend = new window.Backend();
        backend.get();
    }
  };

  /** Рандомизирует и возвращает данные изображений
   * @return {Array}
   */
  Gallery.prototype.randomizeData = function () {
    var unique = [];
    var _quantity = this.config.Quantity.RANDOM;
    while (unique.length < _quantity) {
      var _randomElement = this.data[window.util.getRandomInit(0, this.data.length - 1)];
      if (!unique.includes(_randomElement)) {
        unique.push(_randomElement);
      }
    }
    return unique;
  };

  /** Очищает контейнер с прорисованными изображениями */
  Gallery.prototype.clear = function () {
    this.container.querySelectorAll('.picture').forEach(function (picture) {
      picture.remove();
    });
  };

  /** Фильррует и возвращает данные от самого большого количество комментариев к меньшему
   * @return {Array}
   */
  Gallery.prototype.filterizeData = function () {
    var data = this.data.sort(function (first, secound) {
      if (first.comments.length < secound.comments.length) {
        return 1;
      } else if (first.comments.length > secound.comments.length) {
        return -1;
      } else {
        return 0;
      }
    });
    return data;
  };

  window.Gallery = Gallery;
})();
