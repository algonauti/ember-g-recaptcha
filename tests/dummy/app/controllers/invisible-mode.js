import Controller from '@ember/controller';
import ActionsMixin from '../mixins/actions-mixin';
import getGrecaptcha from 'ember-g-recaptcha/utils/get-grecaptcha';

export default Controller.extend(ActionsMixin, {
  actions: {
    submit() {
      getGrecaptcha().execute();
    },
  }
});
