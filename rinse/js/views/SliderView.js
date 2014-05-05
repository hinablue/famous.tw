define(function(require, exports, module) {
  var Engine               = require('famous/core/Engine');
  var Surface              = require('famous/core/Surface');
  var Modifier             = require('famous/core/Modifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');
  var ContainerSurface     = require('famous/surfaces/ContainerSurface');
  var Utility              = require('famous/utilities/Utility');
  var ScrollView           = require('famous/views/Scrollview');
  var SequentialLayout     = require('famous/views/SequentialLayout');

  function SliderView() {
    View.apply(this, arguments);

    this.sliders = [];
    this._rwdDelay = undefined;
    this._navigationDot = 0;
    this._navigationSurf = [];

    // RWD
    Engine.on('resize', function() {
      if (this._rwdDelay) clearTimeout(this._rwdDelay);
      this._rwdDelay = setTimeout(function() {
        var current, prev, next;
        current = this.options.total - this.options.page >= this.options.total ?
                  this.options.total - 1 : this.options.total - this.options.page <= 0 ?
                  0 : this.options.total - this.options.page;
        prev = current + 1 >= this.options.total ? 0 : current + 1;
        next = current - 1 < 0 ? this.options.total - 1 : current - 1;

        this.sliders[current]._node.get().setTransform(
          Transform.translate(0, 0, 0),
          this.options.transition
        );
        this.sliders[prev]._node.get().setTransform(
          Transform.translate(window.innerWidth * -1, 0, 0),
          this.options.transition
        );
        this.sliders[next]._node.get().setTransform(
          Transform.translate(window.innerWidth, 0, 0),
          this.options.transition
        );
      }.bind(this), 500);
    }.bind(this));

    _createSlider.call(this);
  }

  function _createSlider() {
    this.container = new ContainerSurface({
      size: [undefined, this.options.height],
      properties: {
        overflow: 'hidden',
        backgroundColor: 'rgb(33, 33, 33)'
      }
    });
    this.mod = new Modifier({});

    var surf, mod;

    this.sliderContainer = new ContainerSurface({
      size: [undefined, this.options.height],
      properties: {
        overflow: 'hidden'
      }
    });

    this.container.add(this.sliderContainer);

    // Create slide items
    _createSlideItem.call(this);

    // Navigation
    _createNavigation.call(this);

    // Slogan
    surf = new Surface({
      size: [undefined, this.options.sloganHeight],
      classes: ['rinse-header', 'text-uppercase'],
      content: '<h1 class="slogan">Rinse</h1><h4 class="description">Telling stories behind photography</h4>',
      properties: {
        color: 'white',
        textAlign: 'center'
      }
    });

    mod = new Modifier({
      transform: Transform.translate(0, window.innerHeight / 15, 0)
    });

    this.container.add(mod).add(surf);
    this.container.pipe(this.options.scroller);

    this._add(this.mod).add(this.container);
  }

  function _createNavigation() {
    var surf, mod, container, view;

    for (var i = 0; i < 2; i++) {
      // Prev, Next button
      container = new ContainerSurface({
        size: [115, undefined],
        classes: ['nav-buttons']
      });
      surf = new Surface({
        size: [96, 96],
        classes: ['button-'+(i === 0 ? 'prev' : 'next')],
        content: '<i class="fa fa-angle-'+(i === 0 ? 'left' : 'right')+'"></i>',
        properties: {
          textAlign: 'center',
          fontSize: '96px',
          lineHeight: '96px'
        }
      });
      mod = new Modifier({
        origin: [0.5, 0.5]
      });
      container.add(mod).add(surf);
      mod = new Modifier({
        origin: [i, 0]
      });

      container.on('click', function(key, event) {
        this.slidingPage((key === 0 ? 'prev' : 'next'));
      }.bind(this, i));
      this.container.add(mod).add(container);
    }

    container = new ContainerSurface({
      size: [24 * this.options.total, 12]
    });

    view = new View();
    for (var i=0; i < this.options.total; i++) {
      surf = new Surface({
        classes: (i === 0 ? ['button-page-dot', 'active'] : ['button-page-dot'])
      });
      mod = new Modifier({
        size: (i === 0 ? [12, 12] : [4, 4]),
        transform: Transform.translate(i * 24 + 4, 0, 0),
        origin: [0, 0.5]
      });
      view._add(mod).add(surf);

      surf.on('click', function(key, event) {
        this.jumpToSlide(key);
      }.bind(this, i));

      this._navigationSurf.push({view: view, surf: surf});
    }

    container.add(view);

    mod = new Modifier({
      origin: [0.5, 0.9]
    });

    this.container.add(mod).add(container);
  }

  function _createSlideItem() {
    var view, container, surf, mod, bg, data, background;

    data = {
      author: 'Hina Chen',
      slogan: 'Re-work with Famo.us, original: http://rinse.io',
      message: '“A Salaryman refers to a Japanese white-collar businessman. Every day we have the bluses. The days which are busy with work continue.”'
    };

    for(var i = (this.options.total - 1); i >= 0; i--) {
      container = new ContainerSurface({
        size: [window.innerWidth, undefined]
      });

      background = 'http://placekitten.com/'+window.innerWidth+'/'+this.options.height+'?image='+(this.options.total - i),
      bg = new Surface({
        size: [undefined, undefined],
        classes: ['slide-background'],
        properties: {
          backgroundImage: 'url('+background+')'
        }
      });

      container.add(bg);

      surf = new Surface({
        size: [window.innerHeight / 2, window.innerHeight / 3],
        classes: ['slide-content'],
        content: '<h4 class="author text-uppercase">'+data.author+'</h4><h2 class="slogan text-uppercase"><a href="http://rinse.io">'+data.slogan+'</a></h2><hr class="short-line"><p class="content">'+data.message+'</p>'
      });

      mod = new Modifier({
        origin: [0.5, 0.5]
      });

      container.add(mod).add(surf);

      mod = new Modifier({
        transform: Transform.translate((i === this.options.total - 1 ? window.innerWidth * -1 : i === 0 ? 0 : i === 1 ? window.innerWidth : window.innerWidth * -10), 0, 0)
      });

      view = new View();
      view._add(mod).add(container);

      this.sliders.push(view);
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

  SliderView.prototype = Object.create(View.prototype);
  SliderView.prototype.constructor = SliderView;

  SliderView.prototype.jumpToSlide = function jumpToSlide(slide) {
    var current = this.options.total - this.options.page,
        next = current - 1 < 0 ? this.options.total - 1 : current - 1,
        prev = current + 1 >= this.options.total ? 0 : current + 1,
        feature = this.options.total - (slide + 1);

    if (current === feature) return true;

    _resetNavigation.call(this, slide);

    if (Math.abs(current - feature) === 1) {
      if (current > feature) {
        this.slidingPage('next');
      } else {
        this.slidingPage('prev');
      }
      return true;
    }

    if (Math.abs(current - feature) !== (this.options.total - 1)) {
      this.sliders[next]._node.get().setTransform(
        Transform.translate(window.innerWidth * -10, 0, 0),
        undefined
      );
      this.sliders[prev]._node.get().setTransform(
        Transform.translate(window.innerWidth * -10, 0, 0),
        undefined
      );
    }

    this.sliders[feature]._node.get().setTransform(
      Transform.translate(window.innerWidth * (current > feature ? 1 : -1), 0, 0)
    );
    this.sliders[feature]._node.get().setTransform(
      Transform.translate(0, 0, 0),
      this.options.transition
    );
    this.sliders[current]._node.get().setTransform(
      Transform.translate(window.innerWidth * (current > feature ? -1 : 1), 0, 0),
      this.options.transition
    );

    if (Math.abs(current - feature) !== (this.options.total - 1)) {
      next = feature - 1 < 0 ? this.options.total - 1 : feature - 1;
      prev = feature + 1 >= this.options.total ? 0 : feature + 1;

      if (current > feature) {
        this.sliders[next]._node.get().setTransform(
          Transform.translate(window.innerWidth, 0, 0),
          undefined
        );
      } else {
        this.sliders[prev]._node.get().setTransform(
          Transform.translate(window.innerWidth * -1, 0, 0),
          undefined
        );
      }
    }

    this.options.page = slide + 1;
  }

  SliderView.prototype.slidingPage = function slidingPage(direction) {
    var current, next, prev, feature;

    current = this.options.total - this.options.page >= this.options.total ?
              this.options.total - 1 : this.options.total - this.options.page <= 0 ?
              0 : this.options.total - this.options.page;
    next = current - 1 < 0 ? this.options.total - 1 : current - 1;
    prev = current + 1 >= this.options.total ? 0 : current + 1;
    feature = (direction === 'next') ? (next - 1 < 0 ? this.options.total - 1 : next - 1) : (prev + 1 >= this.options.total ? 0 : prev + 1);

    _resetNavigation.call(this, (direction === 'next' ? this.options.total - next : this.options.total - prev) - 1);

    this.sliders[current]._node.get().setTransform(
      Transform.translate(window.innerWidth * (direction === 'next' ? -1 : 1), 0, 0),
      this.options.transition
    );
    this.sliders[next]._node.get().setTransform(
      Transform.translate((direction === 'next' ? 0 : window.innerWidth * -10), 0, 0),
      (direction === 'next' ? this.options.transition : undefined)
    );
    if (direction === 'next') {
      this.sliders[feature]._node.get().setTransform(
        Transform.translate(window.innerWidth, 0, 0),
        undefined
      );
      this.sliders[prev]._node.get().setTransform(
        Transform.translate(window.innerWidth * -10, 0, 0),
        undefined
      );

      this.options.page++;
      if (this.options.page > this.options.total) this.options.page = 1;
    } else {
      this.sliders[prev]._node.get().setTransform(
        Transform.translate(0, 0, 0),
        this.options.transition
      );
      this.sliders[feature]._node.get().setTransform(
        Transform.translate(window.innerWidth * -1, 0, 0),
        undefined
      );

      this.options.page--;
      if (this.options.page <= 0) this.options.page = this.options.total;
    }
  }

  SliderView.DEFAULT_OPTIONS = {
    scroller: undefined,
    height: 500,
    sloganHeight: 150,
    page: 1,
    total: 10,
    transition: {
      duration: 600,
      curve: 'easeInOut'
    }
  };

  module.exports = SliderView;
});
