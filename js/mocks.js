'use strict';

/** Генерация моков */
(function () {

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

  var QUANTITY = 25;

  var Config = {
    LIKES: {MIN: 15, MAX: 200},
    COMMENTS: {MIN: 0, MAX: 15},
  };

  /**
 * Конструктор мока.
 * @constructor
 * @param {number} number - Порядковый номер мока.
 * @param {Object} options - Параметры мока.
 * @param {number} options.LIKES.MIN - Минимальное количество лайков мока.
 * @param {number} options.LIKES.MAX - Максимальное количество лайков мока.
 * @param {string} options.COMMENTS.MIN - Минимальное количество комментариев мока.
 * @param {string} options.COMMENTS.MAX - Максимальное количество комментариев мока.
 */
  function Mock(number) {
    this.url = 'photos/' + (number + 1) + '.jpg';
    this.options = Config;
    this.likes = window.util.getRandomInit(this.options.LIKES.MIN, this.options.LIKES.MAX);
    this.description = DESCRIPTIONS[window.util.getRandomInit(0, DESCRIPTIONS.length - 1)];
    this.comments = this.getComments(this.options.COMMENTS.MIN, this.options.COMMENTS.MAX);
  }

  /**
   * Генерирует и возвращает комментарии.
   * @param {number} min - Минимальное количество комментарий.
   * @param {number} max - Максимальное количество лайков.
   * @return {Array}
   */
  Mock.prototype.getComments = function (min, max) {
    var quantity = window.util.getRandomInit(min, max);
    var comments = [];
    while (quantity) {
      var _userId = window.util.getRandomInit(0, +NAMES.length - 1);
      comments.push({
        avatar: 'img/avatar-' + (_userId + 1) + '.svg',
        name: NAMES[_userId],
        message: MESSAGES[window.util.getRandomInit(0, MESSAGES.length - 1)]
      });
      quantity--;
    }
    return comments;
  };

  Mock.prototype.getMocks = function () {
    var mocks = [];
    for (var i = 0; i < QUANTITY; i++) {
      mocks.push(new Mock(i));
    }
    return mocks;
  };

  window.mocks = {
    get: Mock.prototype.getMocks
  };
})();
