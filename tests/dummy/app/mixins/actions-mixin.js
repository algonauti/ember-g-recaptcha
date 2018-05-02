import Ember from 'ember';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  actions: {
    onCaptchaResolved(reCaptchaResponse) {
      window.swal(
        'reCaptcha successfully resolved!',
        'See reCaptcha response in the console logs',
        'success'
      );
      Ember.Logger.info('reCaptcha response:\n'+reCaptchaResponse);
    },
    onCaptchaExpired() {
      window.swal({
        title: 'reCaptcha response expired!',
        type: 'warning'
      }, () => {
        this.transitionToRoute('index');
      });
    },
    forceReset() {
      this.get('gRecaptcha').resetReCaptcha();
    }
  }
});
