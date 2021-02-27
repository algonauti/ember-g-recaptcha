import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, render, waitUntil } from '@ember/test-helpers';
import { spy } from 'sinon';

import hbs from 'htmlbars-inline-precompile';

// This key must only be used in development/test mode.
const devRecaptchaKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

module('GRecaptchaComponent', function(hooks) {
  setupRenderingTest(hooks);

  test('uses real version of recaptcha service', async function(assert) {
    this.set('siteKey', devRecaptchaKey);

    await render(hbs`
      <GRecaptcha
        @sitekey={{this.siteKey}}
        @size="compact"
      />
    `);

    await waitUntil(function() {
      return find('.g-recaptcha').childNodes.length > 0
    }, { timeout: 2000 });

    assert.notEqual(this.element.querySelector('.g-recaptcha').childNodes.length, 0);
  });

  module('with @skip argument', function() {
    test('does not download recaptcha library from Google', async function(assert) {
      await render(hbs`
        <GRecaptcha
          @skip={{true}}
        />
      `);

      assert.equal(this.element.querySelector('.g-recaptcha').childNodes.length, 0);
    });

    test('invokes callbacks normally by window.grecaptcha.execute', async function(assert) {
      this.set('successHandler', spy());
      this.set('captchaCaller', spy(() => { window.grecaptcha.execute(); }));

      await render(hbs`
        <div>
          <GRecaptcha
            @skip={{true}}
            @onSuccess={{this.successHandler}}
            @size="compact"
          />

          <button onclick={{action this.captchaCaller}}>Caller</button>
        </div>
      `);

      await click('button');

      assert.ok(this.captchaCaller.called);
      assert.ok(this.successHandler.called);
    });
  });
});
