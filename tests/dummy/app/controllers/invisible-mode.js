import { action } from '@ember/object';
import Controller from '@ember/controller';

export default class GoogleDefaultsController extends Controller {
  @action
  async submit() {
    await window.grecaptcha.execute();
  }
}
