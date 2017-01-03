'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

angular.module('Ringo', []).service('Ringo', function () {
  var service = {};

  service.defaults = function () {
    return {
      color: '#333',
      size: 50,
      thickness: 2
    };
  };

  service.individualize = function (element, attributes) {
    var instance = {};
    var attrs = service.cleanAttributes(attributes);

    if (!Object.keys(attrs).length) return false;

    for (var setting in service.settings) {
      instance[setting] = attrs && typeof attrs[setting] != 'undefined' ? attrs[setting] : service.settings[setting];
    };

    var style = {
      outer: {
        margin: 0.2 * instance.size + 'px auto',
        width: instance.size + 'px',
        height: instance.size + 'px'
      },
      inner: {
        boxShadow: '0 ' + instance.thickness + 'px 0 0 ' + instance.color,
        width: 0.8 * instance.size + 'px',
        height: 0.8 * instance.size + 'px',
        top: 0.1 * instance.size + 'px',
        left: 0.1 * instance.size + 'px',
        borderRadius: 0.4 * instance.size + 'px'
      }
    };

    angular.element(element).css('width', style.outer.width).css('margin', style.outer.margin).css('height', style.outer.height).find('inner').css('width', style.inner.width).css('height', style.inner.height).css('top', style.inner.top).css('left', style.inner.left).css('box-shadow', style.inner.boxShadow).css('border-radius', style.inner.borderRadius);

    return true;
  };

  service.settings = service.defaults();

  service.removeExistingStyle = function () {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ringoStyle';

    var ex = document.getElementById(id);
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

  service.cleanAttributes = function (attributes) {
    var output = {};
    ['color', 'size', 'thickness'].forEach(function (attr) {
      var attrName = 'ring-' + attr;
      if (attrName in attributes) {
        output[attr] = attributes[attrName];
      }
    });
    return output;
  };

  service.ringoCss = function (settings) {
    settings.size = service.numberize(settings.size);
    settings.thickness = service.numberize(settings.thickness);
    return '\n        @keyframes ringspin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n        ringo {\n          background: none;\n          position: relative;\n          display: block;\n          margin: ' + 0.2 * settings.size + 'px auto;\n          width: ' + settings.size + 'px;\n          height: ' + settings.size + 'px;\n        }\n        ringo inner {\n          position: absolute;\n          display: block;\n          width: ' + 0.8 * settings.size + 'px;\n          height: ' + 0.8 * settings.size + 'px;\n          top: ' + 0.1 * settings.size + 'px;\n          left: ' + 0.1 * settings.size + 'px;\n          border-radius: ' + 0.4 * settings.size + 'px;\n          box-shadow: 0 ' + settings.thickness + 'px 0 0 ' + settings.color + ';\n          animation: ringspin 1s linear infinite;\n        }';
  };
  return service;
}).directive('ringo', ['Ringo', function (Ringo) {
  return {
    scope: false,
    restrict: 'E',
    template: '<inner></inner>',
    link: function link(scope, element, attributes) {
      Ringo.initialize();
      Ringo.individualize(element, attributes);
      attributes.$observe('ring-color', function () {
        return Ringo.individualize(element, attributes);
      });
      attributes.$observe('ring-size', function () {
        return Ringo.individualize(element, attributes);
      });
      attributes.$observe('ring-thickness', function () {
        return Ringo.individualize(element, attributes);
      });
    }
  };
}]);