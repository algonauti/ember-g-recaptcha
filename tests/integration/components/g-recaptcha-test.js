import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, waitFor, waitUntil } from '@ember/test-helpers';
import { spy } from 'sinon';

import hbs from 'htmlbars-inline-precompile';

// This is a special key provided by Google to be used only in development/test mode.
const devRecaptchaKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

module('GRecaptchaComponent', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('siteKey', devRecaptchaKey);
    this.set('successHandler', spy());
    this.set(
      'captchaCaller',
      spy(() => window.grecaptcha.execute())
    );
  });

  test('loads real version of recaptcha service', async function (assert) {
    await render(hbs`
      <GRecaptcha
        @sitekey={{this.siteKey}}
        @size="compact"
      />
    `);

    await waitFor('.g-recaptcha > div', { timeout: 2000 });

    assert.dom('.g-recaptcha > div').exists();
  });

  test('invokes callbacks successfully', async function (assert) {
    await render(hbs`
      <div>
        <GRecaptcha
          @sitekey={{this.siteKey}}
          @onSuccess={{this.successHandler}}
          @size="invisible"
        />

        <button {{on 'click' this.captchaCaller}}>Caller</button>
      </div>
    `);

    await waitFor('.g-recaptcha > div', { timeout: 2000 });
    await click('button');

    await waitUntil(
      () => {
        return this.successHandler.called;
      },
      { timeout: 2000 }
    );

    assert.ok(
      this.captchaCaller.called,
      'captchaCaller was called with success'
    );
    assert.ok(
      this.successHandler.called,
      'successHandler was called with success'
    );
  });

  module('with @skip argument', function () {
    test('does not download recaptcha library from Google', async function (assert) {
      await render(hbs`<GRecaptcha @skip={{true}} />`);

      assert.strictEqual(
        this.element.querySelector('.g-recaptcha').childNodes.length,
        0
      );
    });

    test('invokes callbacks normally', async function (assert) {
      // since the callbacks are controlled by the Google code, the only way to force them is using
      // the grecaptcha.execute() function option.
      await render(hbs`
        <div>
          <GRecaptcha
            @skip={{true}}
            @onSuccess={{this.successHandler}}
          />

          <button {{on 'click' this.captchaCaller}}>Caller</button>
        </div>
      `);

      await click('button');

      assert.ok(
        this.captchaCaller.called,
        'captchaCaller was called with success'
      );
      assert.ok(
        this.successHandler.called,
        'successHandler was called with success'
      );
    });
  });
});
