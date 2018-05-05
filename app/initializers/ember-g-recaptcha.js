/*jshint unused:false*/
import ENV from '../config/environment';
import Configuration from 'ember-g-recaptcha/configuration';

export default {
  name: 'ember-g-recaptcha',

  initialize: function(/* registry */) {
    const config = ENV.gReCaptcha || {};
    Configuration.setProperties(config);
  }
};
