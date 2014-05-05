define(function(require, exports, module) {
  var Engine               = require('famous/core/Engine');
  var Surface              = require('famous/core/Surface');
  var Modifier             = require('famous/core/Modifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');
  var Utility              = require('famous/utilities/Utility');
  var ContainerSurface     = require('famous/surfaces/ContainerSurface');
  var ScrollView           = require('famous/views/Scrollview');
  var SequentialLayout     = require('famous/views/SequentialLayout');

  var MenuView             = require('views/MenuView');
  var SliderView           = require('views/SliderView');
  var ContextView          = require('views/ContextView');
  var StoriesView          = require('views/StoriesView');
  var AboutView            = require('views/AboutView');
  var LoadingView          = require('views/LoadingView');

  function AppView() {
    View.apply(this, arguments);

    this.container = new ContainerSurface({
      properties: {
        overflow: 'hidden'
      }
    });
    this.containerMod = new Modifier({
      transform: Transform.translate(0, 0, 0)
    });

    this.views = [];
    this.scrollView = new ScrollView({
      margin: 10000000,
      drag: 0.00005,
      speedLimit: 5
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

    /* Fixed the scroll Infinity issue. */
    this.scrollView.setPosition(0);
    this.scrollView._scroller.on('edgeHit', function() {
      if (this.scrollView._scroller.onEdge() === -1
        && (this.scrollView.getPosition() > -0.01 || this.scrollView.getPosition() === 0)) {
        this.scrollView.setPosition(0);
      } else if (this.scrollView._scroller.onEdge() === 1) {
        if (this.scrollView.getPosition() - this.options.bottomEdge < -0.01) {
          this.scrollView.setPosition(Math.ceil(this.scrollView.getPosition() - 1));
        }
        this.options.bottomEdge = this.scrollView.getPosition();
      }
    }.bind(this));
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    bottomEdge: 0
  };

  module.exports = AppView;
});
