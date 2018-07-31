import Controller from '@ember/controller';
import ActionsMixin from '../mixins/actions-mixin';

export default Controller.extend(ActionsMixin, {
  actions: {
    submit() {
      grecaptcha.execute(); // eslint-disable-line no-undef
    },
  }
});
