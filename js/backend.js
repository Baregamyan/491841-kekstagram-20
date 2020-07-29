(function () {
  var Config = {
    LOAD: {
      URL: 'https://javascript.pages.academy/kekstagram/data',
      TIMEOUT_IN_MS: 10000,
      Message: {
        ERROR: {
          TITLE: 'Ошибка загрузки изображений',
          BUTTON: 'Обновите страницу'
        },
        TIMEOUT: {
          TITLE: 'Время ожидания истекло',
          BUTTON: 'Проверьте интернет и обновите страницу'
        }
      }
    },
    UPLOAD: {
      URL: 'https://javascript.pages.academy/kekstagram',
      TIMEOUT_IN_MS: 1000,
      Message: {
        SUCCESS: {
          TITLE: 'Изображение успешно загруженно',
          BUTTON: 'Круто!'
        },
        ERROR: {
          TITLE: 'Ошибка загрузки файла',
          BUTTON: 'Загрузить другой файл'
        },
        TIMEOUT: {
          TITLE: 'Время ожидания истекло',
          BUTTON: 'Проверьте интернет и попробуйте еще разю'
        }
      }
    }
  }

  function Backend() {
    this.config = Config;
    this.option = {
      load: this.config.LOAD,
      upload: this.config.UPLOAD
    }
    this.loadingPopup = document.querySelector('#messages').content.querySelector('div').cloneNode(true);
    this.successPopup = document.querySelector('#success').content.querySelector('section').cloneNode(true);
    this.errorrPopup = document.querySelector('#error').content.querySelector('section').cloneNode(true);
  }

  Backend.prototype.load = function (type) {
    if (type === 'load') {
      this.result('loadSuccess');
      window.thumbs.render(this.xhr.response);
    } else {
      this.result('uploadSuccess');
    }
  };

  Backend.prototype.error = function (type) {
    if (type === 'load') {
      this.result('loadError');
    } else {
      this.result('uploadError');
    }
  }

  Backend.prototype.timeout = function (type) {
    if (type === 'load') {
      this.result('loadTimeout');
    } else {
      this.result('uloadTimeout');
    }
  }

  Backend.prototype.result = function (result) {
    document.body.removeChild(this.loadingPopup);
    switch (result) {
      case 'uploadSuccess':
        this.popup = this.successPopup;
        this.showResult(this.currentOption.Message.SUCCESS);
        break;
      case 'uploadError':
        this.popup = this.errorrPopup;
        this.showResult(this.currentOption.Message.ERROR);
        break;
      case 'uploadTimeout':
        this.popup = this.errorrPopup;
        this.showResult(this.currentOption.Message.TIMEOUT);
        break
      case 'loadError':
        this.popup = this.errorrPopup;
        this.showResult(this.currentOption.Message.ERROR);
        break;
      case 'loadTimeout':
        this.popup = this.errorrPopup;
        this.showResult(this.currentOption.Message.TIMEOUT);
        break;
      default:
    }
  }

  Backend.prototype.showResult = function (message) {
    this.popup.querySelector('h2').textContent = message.TITLE;
    this.popup.querySelector('button').textContent = message.BUTTON

    this.onButtonClose = this.hideResult.bind(this)
    this.onKeydown = this.keydown.bind(this);

    this.popup.querySelector('button').addEventListener('click', this.onButtonClose);
    document.addEventListener('keydown', this.onKeydown);
    document.body.appendChild(this.popup);
    this.close()
  };

  Backend.prototype.hideResult = function () {
    this.popup.querySelector('button').removeEventListener('click', this.onButtonClose);
    document.removeEventListener('keydown', this.onKeydown);
    document.body.removeChild(this.popup);
  };

  Backend.prototype.keydown = function (evt) {
    if (evt.keyCode === window.util.keycode.ESC) {
      this.hideResult(this.popup)
    }
  }

  Backend.prototype.get = function () {
    this.xhr = new XMLHttpRequest();
    this.xhr.responseType = 'json';

    this.onXhrLoad = this.load.bind(this, 'load');
    this.onXhrError = this.error.bind(this, 'load');
    this.onXhrTimeout = this.timeout.bind(this, 'load');

    this.xhr.addEventListener('load', this.onXhrLoad);
    this.xhr.addEventListener('error', this.onXhrError);
    this.xhr.addEventListener('timeout', this.onXhrTimeout);

    this.currentOption = this.option.load;

    this.xhr.timeout = this.currentOption.TIMEOUT_IN_MS;
    this.xhr.open('GET', this.currentOption.URL);
    this.xhr.send();

    document.body.appendChild(this.loadingPopup);
  }

  Backend.prototype.post = function (data) {
    this.xhr = new XMLHttpRequest();
    this.xhr.responseType = 'json';

    this.onXhrLoad = this.load.bind(this, 'upload');
    this.onXhrError = this.error.bind(this, 'upload');
    this.onXhrTimeout = this.timeout.bind(this, 'upload');

    this.xhr.addEventListener('load', this.onXhrLoad);
    this.xhr.addEventListener('error', this.onXhrError);
    this.xhr.addEventListener('timeout', this.onXhrTimeout);

    this.currentOption = this.option.upload;

    this.xhr.timeout = this.currentOption.TIMEOUT_IN_MS;
    this.xhr.open('POST', this.currentOption.URL);
    this.xhr.send(data);

    document.body.appendChild(this.loadingPopup);
  }

  Backend.prototype.close = function () {

    this.xhr.removeEventListener('load', this.onXhrLoad);
    this.xhr.removeEventListener('error', this.onXhrError);
    this.xhr.removeEventListener('timeout', this.onXhrTimeout);
  }

  window.Backend = Backend;
})();
