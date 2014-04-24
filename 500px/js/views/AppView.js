define(function(require, exports, module) {
  var Engine               = require('famous/core/Engine');
  var Surface              = require('famous/core/Surface');
  var Modifier             = require('famous/core/Modifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');
  var Utility              = require('famous/utilities/Utility');
  var SequentialLayout     = require("famous/views/SequentialLayout");

  /**
   * Custom View
   */
  var GithubBannerView     = require('views/GithubBannerView');
  var TitleBannerView      = require('views/TitleBannerView');
  var PhotosView           = require('views/PhotosView');
  var LoadingBannerView    = require('views/LoadingBannerView');

  function AppView() {
    View.apply(this, arguments);

    /**
     * Create Loading Banner
     */
    var githubBanner = new GithubBannerView();
    this._add(githubBanner);

    /**
     * Create Loading Banner
     */
    this.loadingBanner = new LoadingBannerView();
    this._add(this.loadingBanner);

    /**
     * Create Sequential layout
     */
    this.views = [];
    this.sequentialLayout = new SequentialLayout({
        direction: Utility.Direction.Y
    });
    this.sequentialLayout.sequenceFrom(this.views);

    var mod = new Modifier({
      origin: [0.5, 0]
    });

    this._add(mod).add(this.sequentialLayout);
    // Add the loading banner here.

    /**
     * Create Title Banner
     */
    this.titleBanner = new TitleBannerView({
        size: [this.options.width, this.options.bannerHeight]
    });

    this.views.push(this.titleBanner);

    /**
     * Create 500px photo stream
     */
    this.photosView = new PhotosView({
      height: this.options.height - this.options.bannerHeight,
      width: this.options.width,
      loadingBanner: this.loadingBanner
    });

    this.views.push(this.photosView);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
      height: this.height || window.innerHeight,
      width: this.width || window.innerWidth >= 900 ? 900 : window.innerWidth >= 600 ? 600 : 300,
      bannerHeight: 50
  };

  module.exports = AppView;
});
