import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { merge } from '@ember/polyfills';
import Configuration from '../configuration';

export default Component.extend({

  classNames: ['g-recaptcha'],

  sitekey: Configuration.siteKey,

  tabindex: alias('tabIndex'),

  renderReCaptcha() {
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
      'expired-callback': this.get('expiredCallback').bind(this),
    });
    let widgetId = window.grecaptcha.render(this.get('element'), parameters);
    this.set('widgetId', widgetId);
    this.set('ref', this);
    this.renderCallback()
  },

  resetReCaptcha() {
    if (isPresent(this.get('widgetId'))) {
      window.grecaptcha.reset(this.get('widgetId'));
    }
  },

  renderCallback() {
    let action = this.get('onRender');
    if (isPresent(action)) {
      action();
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

  appendScript(src) {
    let scriptTag = document.createElement('script');
    scriptTag.src = src;
    document.body.appendChild(scriptTag);
  },

  // Lifecycle Hooks

  didInsertElement() {
    this._super(...arguments);
    window.__ember_g_recaptcha_onload_callback = () => { this.renderReCaptcha(); };
    let baseUrl = Configuration.jsUrl || 'https://www.google.com/recaptcha/api.js?render=explicit';
    this.appendScript(`${baseUrl}&onload=__ember_g_recaptcha_onload_callback`)
  }

});
