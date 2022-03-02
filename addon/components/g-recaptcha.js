/* globals grecaptcha */

import { action, get } from '@ember/object';
import { cached } from '@glimmer/tracking';
import { getOwner } from '@ember/application';
import { isPresent } from '@ember/utils';
import { guidFor } from '@ember/object/internals';
import Component from '@glimmer/component';

export default class GRecaptchaComponent extends Component {
  elementId = guidFor(this);

  @cached
  get config() {
    const _config =
      getOwner(this).resolveRegistration('config:environment') || {};

    return _config['ember-g-recaptcha'] || {};
  }

  @cached
  get componentOptions() {
    const defaults = [
      'sitekey',
      'theme',
      'size',
      'tabindex',
      'badge',
      'isolated',
    ];

    const options = {};

    defaults.forEach((option) => {
      if (isPresent(get(this.args, option))) {
        options[option] = get(this.args, option);
      }
    });

    return options;
  }

  @cached
  get options() {
    return Object.assign({}, this.config, this.componentOptions);
  }

  reset() {
    if (isPresent(this.widgetId)) {
      grecaptcha.reset(this.widgetId);
    }
  }

  @action
  _initialize(element) {
    window[`__ember_g_recaptcha_${this.elementId}_onload`] = () => {
      this._render(element);
    };

    this._appendScript(
      [
        `${
          this.config['jsUrl'] || 'https://www.google.com/recaptcha/api.js'
        }?render=explicit`,
        `onload=__ember_g_recaptcha_${this.elementId}_onload`,
        this.config['hl'] ? `hl=${this.config['hl']}` : '',
      ].join('&')
    );
  }

  @action
  _destroy() {
    window[`__ember_g_recaptcha_${this.elementId}_onload`] = () => {};
  }

  _appendScript(src) {
    let scriptTag = document.createElement('script');
    scriptTag.src = src;
    scriptTag.async = true;
    scriptTag.defer = true;

    document.body.appendChild(scriptTag);
  }

  _render(element) {
    const parameters = Object.assign(this.options, {
      callback: this._onSuccessCallback.bind(this),
      'expired-callback': this._onExpiredCallback.bind(this),
      'error-callback': this._onErrorCallback.bind(this),
    });

    this.widgetId = grecaptcha.render(element, parameters);

    this._onRenderCallback();
  }

  _onRenderCallback() {
    this._invokeCallback('onRender', this);
  }

  _onSuccessCallback(response) {
    this._invokeCallback('onSuccess', response);
  }

  _onExpiredCallback() {
    this._invokeCallback('onExpired');
  }

  _onErrorCallback(error) {
    this._invokeCallback('onError', error);
  }

  _invokeCallback(callback, value) {
    const _callback = this.args[callback];

    if (isPresent(_callback) && typeof _callback === 'function') {
      _callback(value);
    }
  }
}
