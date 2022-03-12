# ember-g-recaptcha

Easily integrate [Google's reCaptcha](https://developers.google.com/recaptcha/) in your app as an Ember Component.

## Install

Run the following command from inside your ember-cli project:

`ember install ember-g-recaptcha`

- Ember.js v3.24 or above
- Ember CLI v3.24 or above
- Node.js v12 or above

## Configure

You need to generate a valid Site Key / Secret Key pair on [Google's reCaptcha admin console](https://www.google.com/recaptcha/admin).
Then, you need to set your Site Key in the `ENV` var on your `config/environment.js` file, like this:

```js
var ENV = {
  // ...
};

ENV['ember-g-recaptcha'] = {
  jsUrl: 'https://www.google.com/recaptcha/api.js?render=explicit', // default
  sitekey: 'your-recaptcha-site-key',
  hl: 'tr', // Ex: Turkish
};
```

## Basic Usage

Add the component to your template like this:

```handlebars
<GRecaptcha @onSuccess={{this.onCaptchaResolved}} />
```

then in your component or controller 's actions:

```js
  @action
  onCaptchaResolved(reCaptchaResponse) {
    this.model.set('reCaptchaResponse', reCaptchaResponse);
    // You should then save your model and the server would validate reCaptchaResponse
    // ...
  }
```

## Advanced Usage

### Handling Expiration

You know, after some time the reCaptcha response expires; `g-recaptcha` 's default behavior is to invoke the [reset method](https://developers.google.com/recaptcha/docs/display#js_api). But, if you want to perform custom behavior instead (e.g. transitioning to another route) you can pass your custom action via the `onExpired` property, like this:

```handlebars
<GRecaptcha
  @onSuccess={{this.onCaptchaResolved}}
  @onExpired={{this.onCaptchaExpired}}
/>
```

then in your component or controller 's actions:

```js
  @action
  onCaptchaExpired() {
    // your custom logic here
  }
```

### Triggering Reset

You might want to arbitrarily trigger [reCaptcha reset](https://developers.google.com/recaptcha/docs/display#js_api). For example, if your form submission fails for errors on other fields, you might want to force user to solve a new reCaptcha challenge.
To do that, first you'll need to grab a reference to `g-recaptcha` in your template, like this:

```handlebars
<GRecaptcha
  @onRender={{fn (mut this.gRecaptcha)}}
  @onSuccess={{this.onCaptchaResolved}}
/>
```

then you'll be able to invoke `reset()` method on `gRecaptcha` property anywhere in your component or controller 's code, like this:

```js
this.gRecaptcha.reset();
```

### onRender Callback

You might want to pass a callback function that will be called after the reCaptcha renders on the page. This is great for things like loading spinners. To do so, you can do something like this:

```handlebars
<GRecaptcha
  @onRender={{this.onCaptchaRendered}}
  @onSuccess={{this.onCaptchaResolved}}
/>
```

then in your component or controller 's actions:

```js
  @action
  onCaptchaRendered() {
    // your custom onRender logic
  }

  @action
  onCaptchaResolved() {
    // ...
  }
```

### Skipping real library download

Sometimes you want to have the behavior of a reCAPTCHA but without the burden of injecting the downloaded library into your web page. This is particularly useful during tests.

```handlebars
<GRecaptcha
  @skip={{true}}
  @onSuccess={{this.onCaptchaResolved}}
/>
```

Using `@skip`, you have the power to ignore the reCAPTCHA's real validations but still have the ability to call your success callback.

:warning: This does not work with `onError` and `onExpired`.

### Customization

You can pass `g-recaptcha` the following properties:

- `sitekey`
- `theme`
- `size`
- `tabindex`
- `badge`
- `isolated`
- `skip`*

Their meaning is described on [this official doc](https://developers.google.com/recaptcha/docs/display#render_param).
Also have a look at the dummy app's [example templates](https://github.com/algonauti/ember-g-recaptcha/tree/master/tests/dummy/app/templates).

\* The `skip` option is not a official option.

### Invisible reCaptcha

#### Invisible reCaptcha requires different key than classic reCaptcha. You need to register a new key with `invisible` type. [More information](https://developers.google.com/recaptcha/docs/invisible#config)

In some cases you may want to use reCaptcha in the [invisible mode](https://developers.google.com/recaptcha/docs/invisible). The only thing you need do is to add `size` key to `g-recaptcha` component with `invisible` value and create a button with submit type, so you will get something like this:

```handlebars
<GRecaptcha @onSuccess={{this.onCaptchaResolved}} @size='invisible' />

<button {{on 'click' this.submit}} type='button'>Hello</button>
```

Then in your component you need to define `submit` method which will execute `reCaptcha`. For example:

```js
@action
async submit() {
  await window.grecaptcha.execute();
  // Process rest of operations
}
```

### Configuring source JavaScript URL

In some countries, such as China, you may need to customize the source JavaScript URL. Since the google.com domain is blocked in China, you
must set the `jsUrl` in the configuration to use the `recaptcha.net`. This works outside China as well.

```js
var ENV = {
  // ...
};

ENV['ember-g-recaptcha'] = {
  jsUrl: 'https://www.google.com/recaptcha/api.js?render=explicit', // default
  sitekey: 'your-recaptcha-site-key',
};
```

This also requires the backend URL to be set to `https://recaptcha.net/recaptcha/api/siteverify`. For more information on configuring the `jsUrl`, see [this issue](https://github.com/google/recaptcha/issues/87#issuecomment-368252094).

## License

ember-g-recaptcha is released under the [MIT License](http://www.opensource.org/licenses/MIT).
