# ember-g-recaptcha

Easily integrate [Google's reCaptcha](https://developers.google.com/recaptcha/) in your app as an Ember Component.


## Configuration

You need to generate a valid Site Key / Secret Key pair on [Google's reCaptcha admin console](https://www.google.com/recaptcha/admin).
Then, you need to set your Site Key in the `ENV` var on your `config/environment.js` file, like this:

```js
  var ENV = {
    // ...

    gReCaptcha: {
      siteKey: 'your-recaptcha-site-key'
    }

    // ...
  }
```


## Usage

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

You can pass `g-recaptcha` the following properties:

* `theme`
* `type`
* `size`
* `tabIndex`

Their meaning is described on [this official doc](https://developers.google.com/recaptcha/docs/display#render_param)

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


## License

ember-g-recaptcha is released under the [MIT License](http://www.opensource.org/licenses/MIT).
