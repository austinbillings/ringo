angular.module('Ringo', [])
  .service('RingoService', () => {
    let service = {};

    service.defaults = () => {
      return {
        color: '#222',
        size: '50px',
        thickness: '2px'
      }
    }

    service.settings = service.defaults();

    service.removeExistingStyle = () => {
      let ex = document.getElementById('ringoStyle');
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
  .directive('ringo', ['RingoService', function (RingoService) {
    return {
      scope: false,
      restrict: 'E',
      template: '<inner></inner>',
      link: (scope, el, attrs) => RingoService.initialize()
    };
  }]);
