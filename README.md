# ember-g-recaptcha

Easily integrate [Google's reCaptcha](https://developers.google.com/recaptcha/) in your app as an Ember Component.

**This addon only supports Ember 3 or above**

## Install

Run the following command from inside your ember-cli project:

`ember install ember-g-recaptcha`

* Ember.js v3.24 or above
* Ember CLI v3.24 or above
* Node.js v12 or above

## Configure

You need to generate a valid Site Key / Secret Key pair on [Google's reCaptcha admin console](https://www.google.com/recaptcha/admin).
Then, you need to set your Site Key in the `ENV` var on your `config/environment.js` file, like this:

```js
var ENV = {
  // ...

  gReCaptcha: {
    jsUrl: "https://www.google.com/recaptcha/api.js?render=explicit", // default
    siteKey: "your-recaptcha-site-key",
  },

  // ...
};
```

## Basic Usage

Add the component to your template like this:

```
{{g-recaptcha onSuccess=(action "onCaptchaResolved")}}
```

then in your component or controller 's actions:

```js
  actions: {
    onCaptchaResolved(reCaptchaResponse) {
      this.get('model').set('reCaptchaResponse', reCaptchaResponse);
      // You should then save your model and the server would validate reCaptchaResponse
      // ...
    },
  }
```

## Advanced Usage

### Handling Expiration

You know, after some time the reCaptcha response expires; `g-recaptcha` 's default behavior is to invoke the [reset method](https://developers.google.com/recaptcha/docs/display#js_api). But, if you want to perform custom behavior instead (e.g. transitioning to another route) you can pass your custom action via the `onExpired` property, like this:

```
{{g-recaptcha onSuccess=(action "onCaptchaResolved")
              onExpired=(action "onCaptchaExpired") }}
```

then in your component or controller 's actions:

```js
  actions: {
    onCaptchaExpired() {
      // your custom logic here
    },
  }
```

### Triggering Reset

You might want to arbitrarily trigger [reCaptcha reset](https://developers.google.com/recaptcha/docs/display#js_api). For example, if your form submission fails for errors on other fields, you might want to force user to solve a new reCaptcha challenge.
To do that, first you'll need to grab a reference to `g-recaptcha` in your template, like this:

```
{{g-recaptcha onSuccess=(action "onCaptchaResolved")
              ref=(mut gRecaptcha) }}
```

then you'll be able to invoke `resetReCaptcha()` method on `gRecaptcha` property anywhere in your component or controller 's code, like this:

```js
this.get("gRecaptcha").resetReCaptcha();
```

### onRender Callback

You might want to pass a callback function that will be called after the reCaptcha renders on the page. This is great for things like loading spinners. To do so, you can do something like this:

```
{{g-recaptcha onSuccess=(action "onCaptchaResolved")
              onRender=(action "onCaptchaRendered") }}

```

then in your component or controller 's actions:

```js
  actions: {
    onCaptchaResolved() {
      // ...
    },
    onCaptchaRendered() {
      // your custom onRender logic
    }
  }
```

### Customization

You can pass `g-recaptcha` the following properties:

- `theme`
- `type`
- `size`
- `tabIndex`
- `hl`
- `badge`

Their meaning is described on [this official doc](https://developers.google.com/recaptcha/docs/display#render_param).
Also have a look at the dummy app's [example templates](https://github.com/algonauti/ember-g-recaptcha/tree/master/tests/dummy/app/templates).

### Invisible reCaptcha

#### Invisible reCaptcha requires different key than classic reCaptcha. You need to register a new key with `invisible` type. [More information](https://developers.google.com/recaptcha/docs/invisible#config)

In some cases you may want to use reCaptcha in the [invisible mode](https://developers.google.com/recaptcha/docs/invisible). The only thing you need do is to add `size` key to `g-recaptcha` component with `invisible` value and create a button with submit type, so you will get something like this:

```
{{g-recaptcha
  onSuccess=(action "onCaptchaResolved")
  size="invisible"
}}

<button {{action "submit"}} type="submit">Hello</button>
```

Then in your component you need to define `submit` method which will execute `reCaptcha`. For example:

```js
actions: {
  submit() {
    window.grecaptcha.execute();
    // Process rest of operations
  }
}
```

### Configuring source JavaScript URL

In some countries, such as China, you may need to customize the source JavaScript URL. Since the google.com domain is blocked in China, you
must set the `jsUrl` in the configuration to use the `recaptcha.net`. This works outside China as well.

```js
var ENV = {
  // ...

  gReCaptcha: {
    jsUrl: "https://recaptcha.net/recaptcha/api.js?render=explicit", // overridden
    siteKey: "your-recaptcha-site-key",
  },

  // ...
};
```

This also requires the backend URL to be set to `https://recaptcha.net/recaptcha/api/siteverify`. For more information on configuring the `jsUrl`, see [this issue](https://github.com/google/recaptcha/issues/87#issuecomment-368252094).

## License

ember-g-recaptcha is released under the [MIT License](http://www.opensource.org/licenses/MIT).
