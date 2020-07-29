'use strict';
(function () {

  window.addEventListener('load', onWindowLoad);

  function onWindowLoad() {

    /** Загружает фотографии с сервера.  */
    var backend = new window.Backend();
    backend.get();

    /** Инициирует форму. */
    var form = new window.Form();
    form.init();
  }

})();
