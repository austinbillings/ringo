'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

angular.module('Ringo', []).service('RingoService', function () {
  var service = {};

  service.defaults = function () {
    return {
      color: '#222',
      size: '50px',
      thickness: '2px'
    };
  };

  service.settings = service.defaults();

  service.removeExistingStyle = function () {
    var ex = document.getElementById('ringoStyle');
    if (ex) ex.remove();
  };

  service.replaceStyle = function () {
    service.removeExistingStyle();
    var css = service.ringoCss(service.settings);
    var tag = '<style id="ringoStyle">' + css + '</style>';
    angular.element(document).find('head').append(tag);
  };

  service.applySettings = function (settings) {
    if (!settings || (typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) != 'object') return;
    Object.keys(service.defaults()).forEach(function (key) {
      if (settings.hasOwnProperty(key)) service.settings[key] = settings[key];
    });
  };

  service.initialize = function (settings) {
    if (settings) service.applySettings(settings);
    service.replaceStyle();
  };

  service.numberize = function (n) {
    return n === n + 0 ? n : parseInt(n.toLowerCase().replace('px', '').trim());
  };

  service.ringoCss = function (settings) {
    settings.size = service.numberize(settings.size);
    settings.thickness = service.numberize(settings.thickness);
    return '\n        @keyframes ringspin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n        ringo {\n          background: none;\n          position: relative;\n          display: block;\n          margin: ' + 0.2 * settings.size + 'px auto;\n          width: ' + settings.size + 'px;\n          height: ' + settings.size + 'px;\n        }\n        ringo inner {\n          position: absolute;\n          display: block;\n          width: ' + 0.8 * settings.size + 'px;\n          height: ' + 0.8 * settings.size + 'px;\n          top: ' + 0.1 * settings.size + 'px;\n          left: ' + 0.1 * settings.size + 'px;\n          border-radius: ' + 0.4 * settings.size + 'px;\n          box-shadow: 0 ' + settings.thickness + 'px 0 0 ' + settings.color + ';\n          animation: ringspin 1s linear infinite;\n        }';
  };
  return service;
}).directive('ringo', ['RingoService', function (RingoService) {
  return {
    scope: false,
    restrict: 'E',
    template: '<inner></inner>',
    link: function link(scope, el, attrs) {
      return RingoService.initialize();
    }
  };
}]);