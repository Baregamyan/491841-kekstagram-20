'use strict';
/**
 * Возвращает случайное число в заданных параметрах.
 * @param {number} min - Минимально возможное случайное число.
 * @param {number} max - Максимально возможное случайное число.
 * @return {number}
 */
function getRandomInit(min, max) {
  var rand = min + Math.random() * (max - min);
  return Math.round(rand);
}

/** Данные для генерации моков.*/
var NAMES = [
  'Анна',
  'Женя',
  'Света',
  'Настя',
  'Маша',
  'Саша'
];

var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

var MOCK_OPTIONS = {
  LIKES: {
    MIN: 15, MAX: 200
  },
  COMMENTS: {
    MIN: 0, MAX: 15
  }
};

/** Коды используемых клавиш */
var Keycode = {
  ESC: 27,
  ENTER: 13
};

/** Количество миниатюр.*/
var THUMBS_QUANTITY = 25;

/** Количество загружаемых комментариев за раз */
var COMMENTS_PER_LOAD = 5;

/**
 * Конструктор мока.
 * @constructor
 * @param {umber} number - Порядковый номер мока.
 * @param {Object} options - Параметры мока.
 * @param {number} options.LIKES.MIN - Минимальное количество лайков мока.
 * @param {number} options.LIKES.MAX - Максимальное количество лайков мока.
 * @param {string} options.COMMENTS.MIN - Минимальное количество комментариев мока.
 * @param {string} options.COMMENTS.MAX - Максимальное количество комментариев мока.
 */
function Mock(number, options) {
  this.url = 'photos/' + (number + 1) + '.jpg';
  this.likes = getRandomInit(options.LIKES.MIN, options.LIKES.MAX);
  this.description = DESCRIPTIONS[getRandomInit(0, DESCRIPTIONS.length - 1)];
  this.comments = this.getComments(options.COMMENTS.MIN, options.COMMENTS.MAX);
}

/**
 * Генерирует и возвращает комментарии.
 * @param {number} min - Минимальное количество комментарий.
 * @param {number} max - Максимальное количество лайков.
 * @return {Array}
 */
Mock.prototype.getComments = function (min, max) {
  var quantity = getRandomInit(min, max);
  var comments = [];
  while (quantity) {
    var _userId = getRandomInit(0, +NAMES.length - 1);
    comments.push({
      avatar: 'img/avatar-' + (_userId + 1) + '.svg',
      name: NAMES[_userId],
      message: MESSAGES[getRandomInit(0, MESSAGES.length - 1)]
    });
    quantity--;
  }
  return comments;
};

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
 * @param {number} quantity - Количество миниатюр.
 * @param {string} parentClass - Класс контейнера, который должен быть родителем всех миниатюр. TODO: Передавать вместо класса сам елемент?
 */
Thumb.prototype.render = function (quantity, parentClass) {
  this.quantity = quantity;
  this.parent = document.querySelector(parentClass);
  this._fragment = document.createDocumentFragment();
  for (var i = 0; i < quantity; i++) {
    this.mock = new Mock(i, MOCK_OPTIONS);
    this.thumb = new Thumb(this.mock.url, this.mock.likes, this.mock.comments, this.mock.description);
    this.thumbNode = this.thumb.getNode();
    this.thumbNode.addEventListener('click', this.thumb.onThumbClick.bind(this.thumb));
    this._fragment.appendChild(this.thumbNode);
  }
  this.parent.appendChild(this._fragment);
};

/** Слушатель события нажатия на миниатюру */
Thumb.prototype.onThumbClick = function () {
  this.picture = new Picture(this.url, this.likes, this.comments, this.description);
  this.picture.show();
};

/**
 * Конструктор модального окна с большой фотографией
 * @param {string} url - Адрес фотографии.
 * @param {number} likes - Количество лайков, поставленных фотографии.
 * @param {Array} comments - Комментарии к фотографии.
 * @param {string} description - Описание к фотографии.
 */
function Picture(url, likes, comments, description) {
  this.url = url;
  this.likes = likes;
  this.comments = comments;
  this.description = description;
}

/** Показывает модальное окно с большой фотографией */
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

/** Генерирует комментарии */
Picture.prototype.generateComments = function () {
  this.list = this.template.querySelector('.social__comments');
  this.list.textContent = '';
  this.moreButton = this.template.querySelector('.comments-loader');
  this.onMoreButtonClick = this.more.bind(this);
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

/** При нажатии на кнопку «Загрузить ещё» загружает новые комментарии */
Picture.prototype.more = function () {
  this.loadComments();
};

/**
 * Слушатель нажатия на клавиатуру при открытом окне с фотографией.
 * @param {Object} evt - Объект события.
 */
Picture.prototype.keyDown = function (evt) {
  if (evt.keyCode === Keycode.ESC) {
    this.hide();
  }
};

/** Загружает комментарии */
Picture.prototype.loadComments = function () {
  this.update();
  var step = this.unloaded >= COMMENTS_PER_LOAD ? COMMENTS_PER_LOAD : this.unloaded;
  this.moreButton.classList.toggle('hidden', false);
  while (step) {
    var currentComment = this.getComment(this.comments[this.total - this.unloaded]);
    this.list.appendChild(currentComment);
    this.update();
    this.template.querySelector('.social__comment-count').firstChild.textContent = this.loaded + ' из ';
    step--;
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

Thumb.prototype.render(THUMBS_QUANTITY, '.pictures');

