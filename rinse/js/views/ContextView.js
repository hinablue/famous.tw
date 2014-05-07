define(function(require, exports, module) {
  var Surface              = require('famous/core/Surface');
  var Modifier             = require('famous/core/Modifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');
  var ContainerSurface     = require('famous/surfaces/ContainerSurface');

  function ContextView() {
    View.apply(this, arguments);

    _createContext.call(this);
  }

  function _createContext() {
    this.container = new ContainerSurface({
      size: [undefined, this.options.height],
      properties: {
        overflow: 'hidden'
      }
    });

    var surf = new Surface({
      size: [window.innerWidth * 0.8, this.options.height * 2 / 3],
      classes: ['story-context'],
      content: '<h1 class="slogan">Where there is photography, there are stories.</h1><p class="description">We believe that every photograph comes along with a story. It can be a capture of a moment, a state of mind or just life itself. No matter what the story is, it’s the reason why photography matters. It’s also why we created Rinse — a place for photographers to tell their stories behind photography.</p><a href="#" class="button-whats-your-story text-uppercase">What\'s your story?</button>',
      properties: {
        textAlign: 'center'
      }
    });
    var mod = new Modifier({
      origin: [0.5, 0.5]
    });

    this.container.add(mod).add(surf);
    //this.container.pipe(this.options.scroller);

    this.add(this.container);
  }

  ContextView.prototype = Object.create(View.prototype);
  ContextView.prototype.constructor = ContextView;

  ContextView.DEFAULT_OPTIONS = {
    scroller: undefined,
    height: 500
  };

  module.exports = ContextView;
});
