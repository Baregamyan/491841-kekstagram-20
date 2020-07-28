'use strict';

(function () {

  var Config = {
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
  };

  function Validation(form) {
    this.form = form;
    this.config = Config;
    this.input = {
      hashtag: {
        element: this.form.querySelector('.text__hashtags'),
        getValue: function () {
          return window.util.getInputValue(this.element).trim();
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
          return window.util.getInputValue(this.element).trim();
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
  }

  Validation.prototype.init = function () {
    this.onInputFocus = this.focus.bind(this);
    this.onInputKeyup = this.check.bind(this);

    this.input.hashtag.element.addEventListener('focus', this.onInputFocus);
    this.input.comment.element.addEventListener('focus', this.onInputFocus);

    this.input.hashtag.element.addEventListener('keyup', this.onInputKeyup);
    this.input.comment.element.addEventListener('keyup', this.onInputKeyup);
  };

  Validation.prototype.focus = function () {
    this.onInputKeydown = this.keydown.bind(this);

    this.input.hashtag.element.addEventListener('keydown', this.onInputKeydown);
    this.input.comment.element.addEventListener('keydown', this.onInputKeydown);
  };

  Validation.prototype.keydown = function (evt) {
    if (evt.keyCode === window.util.keycode.ESC) {
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

  window.Validation = Validation;
})();