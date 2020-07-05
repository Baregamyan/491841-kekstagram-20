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

var THUMBS_QUANTITY = 25;

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
  this.comments = this.getComments(getRandomInit(options.COMMENTS.MIN, options.COMMENTS.MAX));
}

/**
 * Комментарий к моку.
 * @param {number} userId - Порядковый номер сомментария
 */
Mock.prototype.comment = function (userId) {
  this.avatar = 'img/avatar-' + (userId + 1) + '.svg';
  this.name = NAMES[userId];
  this.message = MESSAGES[userId];
};

/**
 * Возвращает комментарии.
 * @param {number} quantity - Количество необходимых комментариев.
 * @return {Array}
 */
Mock.prototype.getComments = function (quantity) {
  var comments = [];
  var i = quantity;
  while (i) {
    comments.push(this.comment(getRandomInit(0, +NAMES.length - 1)));
    i--;
  }
  return comments;
};

/**
 * Возвращает моки.
 * @param {number} quantity - Количество необходимых моков.
 * @return {Array}
 */
Mock.prototype.getMocks = function (quantity) {
  var mocks = [];
  var i = 0;
  while (i < quantity) {
    mocks.push(new Mock(i, MOCK_OPTIONS));
    i++;
  }
  return mocks;
};

/**
 * Конструктор миниатюр фотографии.
 * @param {string} url - Адрес картинки.
 * @param {number} likes - Количество лайков.
 * @param {Array} comments - Комментарии.
 */
function Thumb(url, likes, comments) {
  this.url = url;
  this.likes = likes;
  this.comments = comments;
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

  var _fragment = document.createDocumentFragment();

  Mock.prototype.getMocks(quantity).forEach(function (mock) {
    var thumb = new Thumb(mock.url, mock.likes, mock.comments);
    _fragment.appendChild(thumb.getNode());
  });
  this.parent.appendChild(_fragment);
};

Thumb.prototype.render(THUMBS_QUANTITY, '.pictures');
