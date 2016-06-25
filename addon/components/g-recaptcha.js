import Ember from 'ember';
import Configuration from '../configuration';

export default Ember.Component.extend({

  classNames: ['g-recaptcha'],

  sitekey: Configuration.siteKey,

  tabindex: Ember.computed.alias('tabIndex'),

  renderReCaptcha() {
    if (Ember.isNone(window.grecaptcha)) {
      Ember.run.later(() => {
        this.renderReCaptcha();
      }, 500);
    } else {
      let container = this.$()[0];
      let properties = this.getProperties(
        'sitekey',
        'theme',
        'type',
        'size',
        'tabindex'
      );
      let parameters = Ember.merge(properties, {
        callback: this.get('successCallback').bind(this),
        'expired-callback': this.get('expiredCallback').bind(this)
      });
      let widgetId = window.grecaptcha.render(container, parameters);
      this.set('widgetId', widgetId);
      this.set('ref', this);
    }
  },

  successCallback(reCaptchaResponse) {
    let action = this.get('onSuccess');
    if (Ember.isPresent(action)) {
      action(reCaptchaResponse);
    }
  },

  expiredCallback() {
    let action = this.get('onExpired');
    if (Ember.isPresent(action)) {
      action();
    } else {
      if (Ember.isPresent(this.set('widgetId'))) {
        window.grecaptcha.reset(this.set('widgetId'));
      }
    }
  },


  // Lifecycle Hooks

  didInsertElement() {
    this._super(...arguments);
    Ember.run.next(() => {
      this.renderReCaptcha();
    });
  }

});
