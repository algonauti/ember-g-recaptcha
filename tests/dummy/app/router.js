import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('google-defaults');
  this.route('dark-theme');
  this.route('audio-type');
  this.route('compact-size');
});

export default Router;
