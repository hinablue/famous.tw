define(function(require, exports, module) {
  var View                 = require('famous/core/View');

  function AboutView() {
    View.apply(this, arguments);
  }

  AboutView.prototype = Object.create(View.prototype);
  AboutView.prototype.constructor = AboutView;

  AboutView.DEFAULT_OPTIONS = {};

  module.exports = AboutView;
});
