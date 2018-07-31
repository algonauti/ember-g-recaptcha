import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('google-defaults');
  this.route('dark-theme');
  this.route('audio-type');
  this.route('compact-size');
  this.route('invisible-mode');
});

export default Router;
