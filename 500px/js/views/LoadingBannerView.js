define(function(require, exports, module) {
  var Surface              = require('famous/core/Surface');
  var Fader                = require('famous/modifiers/Fader');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');

  function LoadingBannerView() {
    View.apply(this, arguments);

    this.show = show;
    this.hide = hide;

    this.surf = null;
    this.mod = null;
    this.size = [];

    _createLoading.call(this);
  }

  LoadingBannerView.prototype = Object.create(View.prototype);
  LoadingBannerView.prototype.constructor = LoadingBannerView;

  LoadingBannerView.DEFAULT_OPTIONS = {
    width: window.innerWidth,
    height: window.innerHeight,
    progress: 0
  };

  function _createLoading() {
    this.surf = new Surface({
      size: [this.width, this.height],
      classes: ['loading-banner'],
      content: '<span class="table-wrapper"><span class="table-cell">Loading...</span></span>'
    });
    this.mod = new Fader({
      origin: [0.5, 0.5]
    })
    this._add(this.mod).add(this.surf);
    this.mod.show();
  }

  function show() {
    this.surf.setSize([window.innerWidth, window.innerHeight]);
    this.mod.show();
  }

  function hide() {
    this.mod.hide({}, function() {
      this.surf.setSize([0, 0]);
    }.bind(this));
  }

  module.exports = LoadingBannerView;
});
