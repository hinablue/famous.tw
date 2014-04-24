define(function(require, exports, module) {
  var Surface              = require('famous/core/Surface');
  var View                 = require('famous/core/View');

  function TitleBannerView() {
    View.apply(this, arguments);

    _createBanner.call(this);
  }

  TitleBannerView.prototype = Object.create(View.prototype);
  TitleBannerView.prototype.constructor = TitleBannerView;

  TitleBannerView.DEFAULT_OPTIONS = {
    size: null
  };

  function _createBanner() {
    var textContent  = '<div class="bannerTitle">500px Upcoming, original in <a href="http://500px.com/upcoming">500px</a>.</div>';
    textContent     += '<div class="bannerText">Started by Hina Chen</div>';

    this.surf = new Surface({
      classes: ['banner'],
      size: this.options.size,
      content: textContent
    });
    this._add(this.surf);
  }

  module.exports = TitleBannerView;
});
