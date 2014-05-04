define(function(require, exports, module) {
  var View                 = require('famous/core/View');

  function LoadingView() {
    View.apply(this, arguments);
  }

  LoadingView.prototype = Object.create(View.prototype);
  LoadingView.prototype.constructor = LoadingView;

  LoadingView.DEFAULT_OPTIONS = {};

  module.exports = LoadingView;
});
