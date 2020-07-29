'use strict';
(function () {

  function getThumbData() {
    var backend = new window.Backend()
    backend.get();
  }

  getThumbData();


  // var backend = new window.Backend();
  // backend.get();

  // var thumbs = backend.loaded();
  // console.log(thumbs);
  // window.thumbs.render(thumbs);
  var form = new window.Form();
  form.init();

})();
