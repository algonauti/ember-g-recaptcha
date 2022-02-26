import { action } from '@ember/object';
import Controller from '@ember/controller';

export default class GoogleDefaultsController extends Controller {
  @action
  onCaptchaRendered(gRecaptcha) {
    console.info('reCaptcha just rendered');
    this.gRecaptcha = gRecaptcha;
  }

  @action
  forceReset() {
    console.info('Resetting reCaptcha');
    this.gRecaptcha.reset();
  }
}
