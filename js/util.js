'use strict';

/** Утилитные методы */
(function () {

  /** Коды используемых клавиш */
  var Keycode = {
    ESC: 27,
    ENTER: 13
  };

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

  /**
   *
   * @param {*} number
   * @param {*} max
   */
  function culcPercent(number, max) {
    return (number * 100 / max).toFixed();
  }

  function culcPercentToNumber(precent, min, max) {
    return min + (max * precent / 100);
  }

  function getInputValue(input) {
    return input.value;
  }

  window.util = {
    keycode: Keycode,
    getRandomInit: getRandomInit,
    getInputValue: getInputValue,
    culcPercent: culcPercent,
    culcPercentToNumber: culcPercentToNumber
  };


})();
