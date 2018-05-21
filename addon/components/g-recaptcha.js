import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { isNone } from '@ember/utils';
import { later } from '@ember/runloop';
import { merge } from '@ember/polyfills';
import { isPresent } from '@ember/utils';
import { next } from '@ember/runloop';
import Configuration from '../configuration';

export default Component.extend({

  classNames: ['g-recaptcha'],

  sitekey: Configuration.siteKey,

  tabindex: alias('tabIndex'),

  renderReCaptcha() {
    if (isNone(window.grecaptcha) || isNone(window.grecaptcha.render)) {
      later(() => {
        this.renderReCaptcha();
      }, 500);
    } else {
      let container = this.$()[0];
      let properties = this.getProperties(
        'sitekey',
        'theme',
        'type',
        'size',
        'tabindex',
        'hl'
      );
      let parameters = merge(properties, {
        callback: this.get('successCallback').bind(this),
        'expired-callback': this.get('expiredCallback').bind(this)
      });
      let widgetId = window.grecaptcha.render(container, parameters);
      this.set('widgetId', widgetId);
      this.set('ref', this);
    }
  },

  resetReCaptcha() {
    if (isPresent(this.get('widgetId'))) {
      window.grecaptcha.reset(this.get('widgetId'));
    }
  },

  successCallback(reCaptchaResponse) {
    let action = this.get('onSuccess');
    if (isPresent(action)) {
      action(reCaptchaResponse);
    }
  },

  expiredCallback() {
    let action = this.get('onExpired');
    if (isPresent(action)) {
      action();
    } else {
      this.resetReCaptcha();
    }
  },


  // Lifecycle Hooks

  didInsertElement() {
    this._super(...arguments);
    next(() => {
      this.renderReCaptcha();
    });
  }

});
