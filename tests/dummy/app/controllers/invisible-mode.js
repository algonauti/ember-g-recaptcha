import { action } from '@ember/object';
import Controller from '@ember/controller';
import ActionsMixin from '../mixins/actions-mixin';

export default class GoogleDefaultsController extends Controller.extend(ActionsMixin) {
  @action
  submit() {
    window.grecaptcha.execute();
  }
}
