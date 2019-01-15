'use strict';

module.exports = {
  name: require('./package').name,

  contentFor: function(type, config) {
    var content = '';
    if (type === 'body-footer') {
      var src = config.gReCaptcha.jsUrl || 'https://www.google.com/recaptcha/api.js?render=explicit';
      content = '<script type="text/javascript" src="'+src+'" async></script>';
    }
    return content;
  }
};
