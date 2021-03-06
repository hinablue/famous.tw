define(function(require, exports, module) {
  var Engine               = require('famous/core/Engine');
  var Surface              = require('famous/core/Surface');
  var Modifier             = require('famous/core/Modifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');
  var Utility              = require('famous/utilities/Utility');
  var ContainerSurface     = require('famous/surfaces/ContainerSurface');
  var SequentialLayout     = require('famous/views/SequentialLayout');

  var ScrollExtension      = require('views/ScrollExtension');
  var MenuView             = require('views/MenuView');
  var SliderView           = require('views/SliderView');
  var ContextView          = require('views/ContextView');
  var StoriesView          = require('views/StoriesView');
  var AboutView            = require('views/AboutView');
  var LoadingView          = require('views/LoadingView');

  function AppView() {
    View.apply(this, arguments);

    this.container = new ContainerSurface({
      size: [undefined, undefined],
      properties: {
        overflow: 'hidden'
      }
    });
    this.containerMod = new Modifier({
      transform: Transform.translate(0, 0, 0)
    });

    this.views = [];
    this.scrollView = new ScrollExtension({
      margin: 1000000
    });
    this.scrollView.sequenceFrom(this.views);
    this.container.add(this.scrollView);

    this._add(this.containerMod).add(this.container);

    this.sliderView = new SliderView({
      scroller: this.scrollView,
      height: window.innerHeight > 700 ? 700 : window.innerHeight
    });
    this.views.push(this.sliderView);

    this.contextView = new ContextView({
      scroller: this.scrollView,
      height: 500
    });
    this.views.push(this.contextView);

    this.storiesView = new StoriesView({
      scroller: this.scrollView
    });
    this.views.push(this.storiesView);

    this.menuView = new MenuView({
      containerMod: this.containerMod
    });
    this.add(this.menuView);

    this.aboutView = new AboutView();
    this.add(this.aboutView);

    this.loadingView = new LoadingView();
    this.add(this.loadingView);
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    bottomEdge: 0
  };

  module.exports = AppView;
});
