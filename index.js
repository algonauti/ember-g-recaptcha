/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-g-recaptcha',

  contentFor: function(type, config) {
    var content = '';
    if (type === 'head') {
      let src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      content = `<script type="text/javascript" src="${src}"></script>`;
    }
    return content;
  }
};
