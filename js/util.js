'use strict';
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
   * Возвращает процентный эквивалент числа от другого числа.
   * @param {number} number - Число, которое необходимо конвертировать в процент.
   * @param {number} max - Число, от которого будет расчитываться процент.
   * @retrun {number}
   */
  function culcPercent(number, max) {
    return (number * 100 / max).toFixed();
  }

  /**
   * Возвращает числовой эквивалент процента от числа.
   * @param {number} precent - Процент, который необходимо конвертировать в число.
   * @param {number} min - Минимально возможное значение возвращаемого числа.
   * @param {number} max - Максимально возможное значение возвращаемого числа.
   * @return {number}
   */
  function culcPercentToNumber(precent, min, max) {
    return min + (max * precent / 100);
  }

  /**
   * Возвращает значение поля ввода.
   * @param {HTMLElement} input - HTHML-элемент поля ввода.
   * @return {string}
   */
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
