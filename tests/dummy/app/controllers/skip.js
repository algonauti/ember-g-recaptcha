import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class SkipController extends Controller {
  @action
  auth() {
    window.grecaptcha.execute();
  }

  @action
  forceReset() {
    this.gRecaptcha.resetReCaptcha();
  }

  @action
  onCaptchaRendered(gRecaptcha) {
    console.info('reCaptcha just rendered');
    this.gRecaptcha = gRecaptcha;
  }
}
