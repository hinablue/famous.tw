define(function(require, exports, module) {
  'use strict';

  var Surface              = require('famous/core/Surface');
  var Modifier             = require('famous/core/Modifier');
  var Transform            = require('famous/core/Transform');
  var EventHandler         = require('famous/core/EventHandler');
  var OptionsManager       = require('famous/core/OptionsManager');
  var View                 = require('famous/core/View');
  var ContainerSurface     = require('famous/surfaces/ContainerSurface');
  var Utility              = require('famous/utilities/Utility');

  function Slidershow(options) {
    this.options = Object.create(Slidershow.DEFAULT_OPTIONS);
    this._optionsManager = new OptionsManager(this.options);

    if (options) this.setOptions(options);

    this.total = this.options.sliders.length;
    this.page = 1;
    this._sliders = [];
    this._rwdDelay = undefined;
    this._navigationDot = 0;
    this._navigationSurf = [];

    this._eventOutput = new EventHandler();
    EventHandler.setOutputHandler(this, this._eventOutput);

    _createSlider.call(this);
  }

  Slidershow.DEFAULT_OPTIONS = {
    width: window.innerWidth,
    height: 500,
    transition: {
      duration: 600,
      curve: 'easeInOut'
    }
  };

  function _createSlider() {
    this.container = new ContainerSurface({
      size: [(this.options.width === window.innerWidth ? undefined : this.options.width), this.options.height],
      properties: {
        overflow: 'hidden',
        backgroundColor: 'rgb(33, 33, 33)'
      }
    });

    this.sliderContainer = new ContainerSurface({
      size: [(this.options.width === window.innerWidth ? undefined : this.options.width), this.options.height],
      properties: {
        overflow: 'hidden'
      }
    });

    // Create slide items
    _createSlideItem.call(this);

    // Navigation
    if (this.total > 1) _createNavigation.call(this);

    this.container.add(this.sliderContainer);

    if (this.options.width === window.innerWidth) {
      window.addEventListener('resize', function() {
        this.options.width = window.innerWidth;
      }.bind(this), false);
    }
  }

  function _createNavButton(direction) {
    // Prev, Next button
    var container, surf, mod;

    container = new ContainerSurface({
      size: [true, undefined],
      classes: ['nav-buttons']
    });
    surf = new Surface({
      size: [true, true],
      classes: ['button-'+direction],
      content: '<i class="fa fa-angle-'+(direction === 'prev' ? 'left' : 'right')+'"></i>'
    });
    mod = new Modifier({
      opacity: 0.5,
      origin: [0.5, 0.5]
    });
    container.add(mod).add(surf);
    mod = new Modifier({
      origin: [(direction === 'prev' ? 0 : 1), 0]
    });

    container.on('click', function() {
      this.slidingPage(direction);
    }.bind(this));

    this.container.add(mod).add(container);
  }

  function _createNavBubble(bubble, view) {
    var surf, mod;

    surf = new Surface({
      classes: (bubble === 0 ? ['button-page-dot', 'active'] : ['button-page-dot'])
    });
    mod = new Modifier({
      size: (bubble === 0 ? [12, 12] : [4, 4]),
      transform: Transform.translate(bubble * 24 + 4, 0, 0),
      origin: [0, 0.5]
    });
    view._add(mod).add(surf);

    surf.on('click', function() {
      this.jumpToSlide(bubble);
    }.bind(this));

    this._navigationSurf.push({view: view, surf: surf});
  }

  function _createNavigation() {
    var surf, mod, container, view, i;

    _createNavButton.call(this, 'prev');
    _createNavButton.call(this, 'next');

    container = new ContainerSurface({
      size: [24 * this.total, 12]
    });

    view = new View();
    for (i = 0; i < this.total; i++) {
      _createNavBubble.call(this, i, view);
    }
    container.add(view);

    mod = new Modifier({
      origin: [0.5, 0.9]
    });

    this.container.add(mod).add(container);
  }

  function _createSlideItem() {
    var view, container, surf, mod, bg, content, background, i;

    for(i = (this.total - 1); i >= 0; i--) {
      container = new ContainerSurface({
        size: [undefined, this.options.height]
      });

      if (typeof this.options.sliders[i].background === 'string') {
        background = this.options.sliders[i].background;
      } else {
        background = 'http://placekitten.com/'+this.options.width+'/'+this.options.height+'?image='+(this.total - i - 1);
      }

      bg = new Surface({
        size: [undefined, undefined],
        classes: ['slide-background'],
        properties: {
          backgroundImage: 'url('+background+')'
        }
      });

      container.add(bg);

      if (typeof this.options.sliders[i].content === 'string') {
        surf = new Surface({
          size: [true, true],
          classes: ['slide-content'],
          content: this.options.sliders[i].content
        });

        if (typeof this.options.sliders[i].contentModifier === 'object') {
          container.add(this.options.sliders[i].contentModifier).add(surf);
        } else {
          mod = new Modifier({
            origin: [0.5, 0.5]
          });
          container.add(mod).add(surf);
        }
      } else if (typeof this.options.sliders[i].content === 'object') {
        if (typeof this.options.sliders[i].contentModifier === 'object') {
          container.add(this.options.sliders[i].contentModifier).add(this._sliders[i].content);
        } else {
          container.add(this.options.sliders[i].content);
        }
      }

      mod = new Modifier({
        transform: Transform.translate((i === this.total - 1 ? this.options.width * -1 : i === 0 ? 0 : i === 1 ? this.options.width : this.options.width * -10), 0, 0)
      });

      view = new View({});
      view.add(mod).add(container);

      this._sliders.push(view);
      this.sliderContainer.add(view);
    }
  }

  function _resetNavigation(slide) {
    var nav = this._navigationSurf[this._navigationDot];

    nav.surf.removeClass('active');
    nav.view._node._child[this._navigationDot].get().setSize([4, 4]);
    nav.view._node._child[this._navigationDot].get().setTransform(Transform.translate(this._navigationDot * 24 + 4, 0, 0));
    nav.view._node._child[this._navigationDot].get().setOrigin([0, 0.5]);

    nav = this._navigationSurf[slide];
    nav.surf.addClass('active');
    nav.view._node._child[slide].get().setSize([12, 12]);
    nav.view._node._child[slide].get().setTransform(Transform.translate(slide * 24, 0, 0));
    nav.view._node._child[slide].get().setOrigin([0, 0.5]);

    this._navigationDot = slide;
  }

  Slidershow.prototype.getTotal = function getTotal() {
    return this.total;
  };

  Slidershow.prototype.getPage = function getPage() {
    return this.page;
  };

  Slidershow.prototype.jumpToSlide = function jumpToSlide(slide, direction /* only for prev, next */) {
    var current = this.total - this.page >= this.total ?
              this.total - 1 : this.total - this.page <= 0 ?
              0 : this.total - this.page,
        next = current - 1 < 0 ? this.total - 1 : current - 1,
        prev = current + 1 >= this.total ? 0 : current + 1,
        feature = this.total - (slide + 1);

    if (current === feature) return true;
    var direction = direction || 'feature';

    _resetNavigation.call(this, slide);

    if (Math.abs(current - feature) !== (this.total - 1)) {
      this._sliders[next]._node.get().setTransform(
        Transform.translate(this.options.width * -10, 0, 0),
        undefined
      );
      this._sliders[prev]._node.get().setTransform(
        Transform.translate(this.options.width * -10, 0, 0),
        undefined
      );
    }

    this._sliders[feature]._node.get().setTransform(
      Transform.translate(this.options.width * (current > feature ? 1 : -1), 0, 0)
    );
    this._sliders[feature]._node.get().setTransform(
      Transform.translate(0, 0, 0),
      this.options.transition
    );
    this._sliders[current]._node.get().setTransform(
      Transform.translate(this.options.width * (current > feature ? -1 : 1), 0, 0),
      this.options.transition
    );

    if (Math.abs(current - feature) !== (this.total - 1)) {
      next = feature - 1 < 0 ? this.total - 1 : feature - 1;
      prev = feature + 1 >= this.total ? 0 : feature + 1;

      if (current > feature) {
        this._sliders[next]._node.get().setTransform(
          Transform.translate(this.options.width, 0, 0),
          undefined
        );
      } else {
        this._sliders[prev]._node.get().setTransform(
          Transform.translate(this.options.width * -1, 0, 0),
          undefined
        );
      }
    }

    this.page = slide + 1;
    this.page = (this.page > this.total) ? 1 : (this.page < 1) ? this.total : this.page;

    this._eventOutput.emit('pageChange', {page: this.page, direction: direction});
  };

  Slidershow.prototype.slidingPage = function slidingPage(direction) {
    if (direction === 'next') {
      this.jumpToSlide((this.page >= this.total) ? 0 : this.page, direction);
    } else if (direction === 'prev') {
      this.jumpToSlide((this.page <= 1) ? this.total - 1 : this.page - 2, direction);
    }
  };

  Slidershow.prototype.setOptions = function setOptions(options) {
    if (options.sliders === undefined || options.sliders.length === 0) {
      options.sliders = [];
    }
    if (options.width === undefined || typeof options.width !== 'number') {
      options.width = window.innerWidth;
    }
    if (options.height === undefined || typeof options.height !== 'number') {
      options.height = 500;
    }
    if (options.transition === undefined || typeof options.transition !== 'object') {
      options.transition = {
        duration: 600,
        curve: 'easeInOut'
      };
    }

    this._optionsManager.setOptions(options);
  };

  Slidershow.prototype.render = function render() {
    if (this.total === 0) return null;

    return [
      {
        target: this.container.render()
      }
    ];
  };

  module.exports = Slidershow;
});