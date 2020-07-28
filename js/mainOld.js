'use strict';

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

/** Коды используемых клавиш */
var Keycode = {
  ESC: 27,
  ENTER: 13
};

var Config = {
  SCALE: {
    MIN: {VALUE: 25, TRANSFORM: 25},
    MAX: {VALUE: 100, TRANSFORM: 1},
    DEFAULT: {VALUE: 100, TRANSFORM: 1},
    STEP: 25
  },
  FILTER: {
    CHROME: {MIN: 0, MAX: 1, NAME: 'grayscale', VALUE_TYPE: 'integer'},
    SEPIA: {MIN: 0, MAX: 1, NAME: 'sepia', VALUE_TYPE: 'integer'},
    MARVIN: {MIN: 0, MAX: 100, NAME: 'invert', VALUE_TYPE: 'percent'},
    PHOBOS: {MIN: 0, MAX: 3, NAME: 'blur', VALUE_TYPE: 'pixels'},
    HEAT: {MIN: 1, MAX: 3, NAME: 'brightness', VALUE_TYPE: 'integer'}
  },
  MOCK: {
    LIKES: {MIN: 15, MAX: 200},
    COMMENTS: {MIN: 0, MAX: 15}
  },
  VALIDITY: {
    HASHTAG: {
      LENGTH: {
        MAX: 20,
        getMessage: function () {
          return 'Хештег привышает максимальную длину в ' + this.MAX + ' символов. Проверьте хештег: ';
        }
      },
      QUANTITY: {
        MAX: 5,
        getMessage: function () {
          return 'Максимальное количество хештегов ' + this.MAX + ' символов. Проверьте хештег: ';
        }
      },
      FIRST_SYMBOL: {
        SYMBOL: '#',
        getMessage: function () {
          return 'Первым символом в хештеге должен быть «' + this.SYMBOL + '». Проверьте хештег: ';
        }
      },
      ALLOWED_SYMBOLS: {
        REGEXP: /[^A-Za-z0-9-А-я]+/g,
        getMessage: function (isEmpty) {
          if (isEmpty) {
            return 'Хештег не может содержать только «' + this.FIRST_SYMBOL_EXEPTION + '»';
          } else {
            return 'Хештег должен содержать только буквы и цифры. Проверьте хештег: ';
          }
        },
        FIRST_SYMBOL_EXEPTION: '#'
      },
      UNIQUE: {
        getMessage: function () {
          return 'Хештеги не должны повторяться. Повтор хештэга: ';
        }
      }
    },
    COMMENT: {
      LENGTH: {MAX: 140, getMessage: function () {
        return 'Комментарий привышает максимальную длину в' + this.MAX + 'символов.';
      }}
    }
  }
};

/** Количество миниатюр.*/
var THUMBS_QUANTITY = 25;

/** Количество загружаемых комментариев за раз */
var COMMENTS_PER_LOAD = 5;

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
Thumb.prototype.render = function (quantity, parentClass, data) {
  this.quantity = quantity;
  this.parent = document.querySelector(parentClass);
  this.data = data;
  this._fragment = document.createDocumentFragment();
  for (var i = 0; i < quantity; i++) {
    this.thumb = new Thumb(this.data[i].url, this.data[i].likes, this.data[i].comments, this.data[i].description);
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
  if (evt.keyCode === Keycode.ESC) {
    this.hide();
  }
};

/** Загружает комментарии */
Picture.prototype.loadComments = function () {
  this.update();
  var _step = this.unloaded >= COMMENTS_PER_LOAD ? COMMENTS_PER_LOAD : this.unloaded;
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

Thumb.prototype.render(THUMBS_QUANTITY, '.pictures');

/** Пре загрузки своего изображения */
function Form() {
  this.form = document.querySelector('.img-upload__form');
  this.container = this.form.querySelector('.img-upload__overlay');

  this.onFormChange = this.show.bind(this);
  this.form.addEventListener('change', this.onFormChange, false);
}

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

  this.scale = new Scale(this.form, this.image, Config.SCALE);
  this.filter = new Filter(this.form, this.image, this.scale.setDefault.bind(this.scale), Config.FILTER);
  this.pin = new Pin(this.form, this.filter.set.bind(this.filter));
  this.validation = new Validation(this.form, Config.VALIDITY);

  this.set();
};

Form.prototype.set = function () {
  this.scale.setDefault();
  this.filter.set();
};

Form.prototype.keyDown = function (evt) {
  if (evt.keyCode === Keycode.ESC) {
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

function Scale(form, image, options) {
  this.form = form;
  this.image = image;
  this.step = options.STEP;
  this.min = {
    value: options.MIN.VALUE,
    transform: options.MIN.TRANSFORM
  };
  this.max = {
    value: options.MAX.VALUE,
    transform: options.MAX.TRANSFORM
  };
  this.default = {
    value: options.DEFAULT.VALUE,
    transform: options.DEFAULT.TRANSFORM
  };

  this.bigger = this.form.querySelector('.scale__control--bigger');
  this.current = this.form.querySelector('.scale__control--value');
  this.smaller = this.form.querySelector('.scale__control--smaller');

  this.onBiggerClick = this.up.bind(this);
  this.onSmallerClick = this.down.bind(this);

  this.bigger.addEventListener('click', this.onBiggerClick, false);
  this.smaller.addEventListener('click', this.onSmallerClick, false);
}

Scale.prototype.up = function () {
  var _size;
  var _currentValue = +this.current.value.slice(0, -1);
  if (_currentValue < (this.max.value - this.step)) {
    _size = Number(_currentValue += this.step);
    this._transformValue = '0.' + _size;
  } else {
    _size = this.max.value;
    this._transformValue = '1';
  }
  this.current.value = _size + '%';
  this.image.style = 'transform: scale(' + this._transformValue + ')';
};

Scale.prototype.down = function () {
  var _size;
  var _currentValue = +this.current.value.slice(0, -1);
  if (_currentValue > this.min.value) {
    _size = Number(_currentValue -= this.step);
  } else {
    _size = this.min.value;
  }
  this.current.value = _size + '%';
  this.image.style = 'transform: scale(0.' + _size + ')';
};

Scale.prototype.setDefault = function () {
  this.current.value = this.default.value + '%';
  this.image.style = 'transform: scale(' + this.default.transform + ')';
};

Scale.prototype.close = function () {
  this.bigger.removeEventListener('click', this.onBiggerClick, false);
  this.smaller.removeEventListener('click', this.onSmallerClick, false);
};

function Filter(form, image, scaleDefault, config) {
  this.form = form;
  this.image = image;
  this.scaleDefault = scaleDefault;
  this.config = config;

  this.filters = this.form.querySelectorAll('.effects__radio');
  this.pinContainer = this.form.querySelector('.effect-level');
  this.pin = this.pinContainer.querySelector('.effect-level__pin');

  this.onFilterClick = this.filterClick.bind(this);

  for (var i = 0; i < this.filters.length; i++) {
    var _filter = this.filters[i];
    _filter.addEventListener('click', this.onFilterClick, false);
  }
}

Filter.prototype.set = function (isDefault) {
  var current = this.getCurrent();
  if (current === 'NONE') {
    this.pinContainer.classList.toggle('hidden', true);
    this.image.style = '';
  } else {
    this.pinContainer.classList.toggle('hidden', false);
    if (isDefault) {
      this.pin.style.left = this.pin.parentElement.offsetWidth + 'px';
      this.pin.nextElementSibling.style.width = '100%';
    }
    this.image.style = this.getStyle(current);
  }
};

Filter.prototype.filterClick = function () {
  this.scaleDefault();
  this.set(true);
};

Filter.prototype.getCurrent = function () {
  return this.form.querySelector('.effects__radio:checked').value.toUpperCase();
};

Filter.prototype.getStyle = function (current) {
  var config = this.config[current];
  var _style = config.NAME;
  var _level = this.getLevel(config);
  return 'filter:' + _style + '(' + _level + ')';
};

Filter.prototype.getLevel = function (options) {
  this.options = options;
  this.type = this.options.VALUE_TYPE;
  this.min = this.options.MIN;
  this.max = this.options.MAX;
  this.pinPosition = this.pin.offsetLeft;
  this.parentPinWidth = this.pin.parentElement.offsetWidth;
  this.percentPinPosition = culcPercent(this.pinPosition, this.parentPinWidth);
  switch (this.type) {
    case 'percent':
      return this.percentPinPosition + '%';
    case 'pixels':
      return culcPercentToNumber(this.percentPinPosition, this.min, this.max) + 'px';
    default:
      return culcPercentToNumber(this.percentPinPosition, this.min, this.max);
  }
};

Filter.prototype.close = function () {
  for (var i = 0; i < this.filters.length; i++) {
    var _filter = this.filters[i];
    _filter.removeEventListener('click', this.onFilterClick, false);
  }
};

function Pin(form, filterSet) {
  this.form = form;
  this.filterSet = filterSet;
  this.pin = this.form.querySelector('.effect-level__pin');
  this.position = {
    min: 0,
    max: this.pin.parentElement.offsetWidth
  };
  this.depth = this.form.querySelector('.effect-level__depth');
  this.onPinMousedown = this.mouseDown.bind(this);
  this.pin.addEventListener('mousedown', this.onPinMousedown, false);
}

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
    this.depth.style.width = culcPercent(_position, this.position.max) + '%';
  }

  this.filterSet(false);

  this.coords = {
    x: evt.clientX
  };
};

Pin.prototype.mouseup = function (evt) {
  evt.preventDefault();
  this.dragged = false;
  document.removeEventListener('mousemove', this.onMouseMove, false);
  document.removeEventListener('mouseup', this.onMouseUp, false);
};

function Validation(form, config) {
  this.form = form;
  this.config = config;
  this.input = {
    hashtag: {
      element: this.form.querySelector('.text__hashtags'),
      getValue: function () {
        return getInputValue(this.element).trim();
      },
      config: this.config.HASHTAG,
      errors: [],
      getErrors: function () {
        return this.errors.join('. \n');
      }
    },
    comment: {
      element: this.form.querySelector('.text__description'),
      getValue: function () {
        return getInputValue(this.element).trim();
      },
      config: this.config.COMMENT,
      errors: [],
      getErrors: function () {
        return this.errors.join('. \n');
      }
    }
  };
  this.invalidities = [];

  this.isValid = true;

  this.onInputFocus = this.focus.bind(this);
  this.onInputKeyup = this.check.bind(this);

  this.input.hashtag.element.addEventListener('focus', this.onInputFocus);
  this.input.comment.element.addEventListener('focus', this.onInputFocus);

  this.input.hashtag.element.addEventListener('keyup', this.onInputKeyup);
  this.input.comment.element.addEventListener('keyup', this.onInputKeyup);
}

Validation.prototype.focus = function () {
  this.onInputKeydown = this.keydown.bind(this);

  this.input.hashtag.element.addEventListener('keydown', this.onInputKeydown);
  this.input.comment.element.addEventListener('keydown', this.onInputKeydown);
};

Validation.prototype.keydown = function (evt) {
  if (evt.keyCode === Keycode.ESC) {
    evt.cancelBubble = true;
    evt.preventDefault();
  }
};

Validation.prototype.addInvalidity = function (message) {
  this.invalidities.push(message);
};

Validation.prototype.getInvalidities = function () {
  return this.invalidities.join('. \n');
};

Validation.prototype.check = function () {
  this.invalidities = [];
  if (this.input.hashtag.getValue() !== '') {
    this.checkHashtags(this.input.hashtag);
  } else {
    this.input.hashtag.errors = [];
  }
  if (this.input.comment.getValue() !== '') {
    this.checkComment(this.input.comment);
  } else {
    this.input.comment.errors = [];
  }
  this.showErrors(Object.values(this.input));
};

Validation.prototype.checkHashtags = function (input) {
  input.errors = [];
  this.checkQuantity(input);
  this.checkLength(input, true);
  this.isFirstSymbol(input);
  this.isUnique(input);
  this.checkSymbols(input);
};

Validation.prototype.checkComment = function (input) {
  input.errors = [];
  this.checkLength(input, false);
};

Validation.prototype.checkLength = function (input, perWord) {
  var _config = input.config.LENGTH;
  var _max = _config.MAX;
  var _value = input.getValue();
  var error;
  if (perWord) {
    var hashtags = _value.split(' ');
    for (var i = 0; i < hashtags.length; i++) {
      var hashtag = hashtags[i];
      if (hashtag.length > _max) {
        error = _config.getMessage() + ' «' + hashtag + '»';
        input.errors.push(error);
      }
    }
  } else {
    if (_value.length > _max) {
      error = _config.getMessage() + ' «' + _value + '»';
      input.errors.push(error);
    }
  }
};

Validation.prototype.isFirstSymbol = function (input) {
  var _config = input.config.FIRST_SYMBOL;
  var _symbol = _config.SYMBOL;
  var hashtags = input.getValue().split(' ');
  var error;
  for (var i = 0; i < hashtags.length; i++) {
    var hashtag = hashtags[i];
    if (hashtag[0] !== _symbol) {
      error = _config.getMessage() + ' «' + hashtag + '»';
      input.errors.push(error);
    }
  }
};

Validation.prototype.checkQuantity = function (input) {
  var _config = input.config.QUANTITY;
  var _max = _config.MAX;
  var _value = input.getValue().split(' ');
  var error = _config.getMessage() + ' «' + _value + '»';
  if (_value.length > _max) {
    input.errors.push(error);
  }
};

Validation.prototype.isUnique = function (input) {
  var _config = input.config.UNIQUE;
  var _hashtags = input.getValue().split(' ');
  var error;
  var uniques = [];
  var isUnique = true;

  _hashtags.some(function (hashtag) {
    var _hashtag = hashtag.toLowerCase();
    if (uniques.includes(_hashtag)) {
      error = _config.getMessage() + hashtag;
      isUnique = false;
    } else {
      uniques.push(hashtag);
    }
  });
  if (!isUnique) {
    input.errors.push(error);
  }
};

Validation.prototype.checkSymbols = function (input) {
  var _config = input.config.ALLOWED_SYMBOLS;
  var error;
  var _hashtags = input.getValue().split(' ');
  var _firstSymbol = _config.FIRST_SYMBOL_EXEPTION;
  for (var i = 0; i < _hashtags.length; i++) {
    var hashtag = _hashtags[i];
    if (hashtag[0] === _firstSymbol) {
      hashtag = hashtag.split('').slice(1).join('');
      if (hashtag === '') {
        error = _config.getMessage(true);
        input.errors.push(error);
      } else {
        if (_config.REGEXP.test(hashtag)) {
          error = _config.getMessage(false) + hashtag;
          input.errors.push(error);
        }
      }
    }
  }
};

Validation.prototype.close = function () {
  this.input.hashtag.removeEventListener('focus', this.onInputFocus);
  this.input.comment.removeEventListener('focus', this.onInputFocus);

  this.input.hashtag.removeEventListener('focus', this.onInputKeyup);
  this.input.comment.removeEventListener('focus', this.onInputKeyup);
};

Validation.prototype.showErrors = function (inputs) {
  this.inputsContainer = this.form.querySelector('.img-upload__text');

  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    if (!input.errors.length) {
      input.element.setCustomValidity('');
    } else {
      input.element.setCustomValidity(input.getErrors());
      this.invalidities = this.invalidities.concat(input.errors);
    }
  }
  var list;
  if (this.isValid) {
    list = document.createElement('ul');
    list.classList = 'errors-list';
    list.style = 'list-style: none';
    list.appendChild(this.getErrors(this.invalidities));
    this.inputsContainer.appendChild(list);
  } else {
    list = this.inputsContainer.querySelector('.errors-list');
    list.textContent = '';
    list.appendChild(this.getErrors(this.invalidities));
  }
  this.isValid = false;
};

Validation.prototype.getErrors = function (errors) {
  var fragment = document.createDocumentFragment();
  errors.forEach(function (message) {
    var error = document.createElement('p');
    error.style = 'font-size: 22px; font-weight: bold; color: red;';
    error.textContent = message;
    fragment.appendChild(error);
  });
  return fragment;
};

var form = new Form();