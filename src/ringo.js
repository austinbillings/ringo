angular.module('Ringo', [])
  .service('Ringo', () => {
    let service = {};

    service.defaults = () => {
      return {
        color: '#333',
        size: 50,
        thickness: 2
      }
    }

    service.individualize = (element, attributes) => {
      let instance = {};
      let attrs = service.cleanAttributes(attributes);

      if (!Object.keys(attrs).length) return false;

      for (let setting in service.settings) {
        instance[setting] = (typeof attrs[setting] != 'undefined' ? attrs[setting] : service.settings[setting]);
      };


      let style = {
        outer: {
          margin: `${(0.2 * instance.size)}px auto`,
          width: `${instance.size}px`,
          height: `${instance.size}px`
        },
        inner: {
          boxShadow: `0 ${(instance.thickness)}px 0 0 ${instance.color}`,
          width: `${(0.8 * instance.size)}px`,
          height: `${(0.8 * instance.size)}px`,
          top: `${(0.1 * instance.size)}px`,
          left: `${(0.1 * instance.size)}px`,
          borderRadius: `${(0.4 * instance.size)}px`,
        }
      };

      angular.element(element)
        .css('width', style.outer.width)
        .css('margin', style.outer.margin)
        .css('height', style.outer.height)
        .find('inner')
        .css('width', style.inner.width)
        .css('height', style.inner.height)
        .css('top', style.inner.top)
        .css('left', style.inner.left)
        .css('box-shadow', style.inner.boxShadow)
        .css('border-radius', style.inner.borderRadius);
    }

    service.settings = service.defaults();

    service.removeExistingStyle = (id = 'ringoStyle') => {
      let ex = document.getElementById(id);
      if (ex) ex.remove();
    }

    service.replaceStyle = () => {
      service.removeExistingStyle();
      let css = service.ringoCss(service.settings);
      let tag = `<style id="ringoStyle">${css}</style>`;
      angular.element(document).find('head').append(tag);
    }

    service.applySettings = (settings) => {
      if (!settings || typeof settings != 'object') return;
      Object.keys(service.defaults()).forEach(key => {
        if (settings.hasOwnProperty(key)) service.settings[key] = settings[key];
      });
    }

    service.initialize = (settings) => {
      if (settings) service.applySettings(settings);
      service.replaceStyle();
    }

    service.numberize = (n) => {
      return (n === n + 0 ? n : parseInt(n.toLowerCase().replace('px', '').trim()));
    }

    service.cleanAttributes = attributes => {
      Object.keys(attributes).forEach(attribute => {
        if (attribute.indexOf('$') === 0) delete attributes[attribute];
      });
      return attributes;
    }

    service.ringoCss = (settings) => {
      settings.size = service.numberize(settings.size);
      settings.thickness = service.numberize(settings.thickness);
      return `
        @keyframes ringspin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        ringo {
          background: none;
          position: relative;
          display: block;
          margin: ${(0.2 * settings.size)}px auto;
          width: ${settings.size}px;
          height: ${settings.size}px;
        }
        ringo inner {
          position: absolute;
          display: block;
          width: ${(0.8 * settings.size)}px;
          height: ${(0.8 * settings.size)}px;
          top: ${(0.1 * settings.size)}px;
          left: ${(0.1 * settings.size)}px;
          border-radius: ${(0.4 * settings.size)}px;
          box-shadow: 0 ${(settings.thickness)}px 0 0 ${settings.color};
          animation: ringspin 1s linear infinite;
        }`;
    }
    return service;
  })
  .directive('ringo', ['Ringo', function (Ringo) {
    return {
      scope: false,
      restrict: 'E',
      template: '<inner></inner>',
      link: (scope, element, attributes) => {
        Ringo.initialize()
        Ringo.individualize(element, attributes);
        attributes.$observe('color', () => Ringo.individualize(element, attributes));
        attributes.$observe('size', () => Ringo.individualize(element, attributes));
        attributes.$observe('thickness', () => Ringo.individualize(element, attributes));
      }
    };
  }]);
