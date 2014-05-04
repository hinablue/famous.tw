define(function(require, exports, module) {
  var Surface              = require('famous/core/Surface');
  var Modifier             = require('famous/core/Modifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');
  var ContainerSurface     = require('famous/surfaces/ContainerSurface');
  var Utility              = require('famous/utilities/Utility');
  var ScrollView           = require('famous/views/Scrollview');
  var SequentialLayout     = require('famous/views/SequentialLayout');

  function StoriesView() {
    View.apply(this, arguments);

    this.stories = [];

    _createStories.call(this);
  }

  function _createStories() {

    this.container = new ContainerSurface({
      size: [undefined, (this.options.height + this.options.margin) * (this.options.total / 2) + this.options.sloganHeight],
      classes: ['stories-container']
    });

    var storiesCol, storiesRow, _storiesRow = [], surf, mod, container, view, data, masker;

    storiesCol = new SequentialLayout({
      direction: Utility.Direction.Y
    });
    storiesCol.sequenceFrom(this.stories);

    container = new ContainerSurface({
      size: [this.options.width * 2 + this.options.margin, this.options.sloganHeight]
    });
    surf = new Surface({
      size: [undefined, this.options.sloganHeight / 10],
      classes: ['stories-slogan', 'text-uppercase'],
      content: 'Featured stories'
    });
    mod = new Modifier({
      origin: [0.5, 0.5]
    });
    container.add(mod).add(surf);

    this.stories.push(container);

    for (var i = 0; i < this.options.total / 2; i++) {
      view = new View();

      _storiesRow = [];
      storiesRow = new SequentialLayout({
        direction: Utility.Direction.X
      });
      storiesRow.sequenceFrom(_storiesRow);

      for (var j = 0; j < 2; j++) {
        container = new ContainerSurface({
          size: [this.options.width + (j === 0 ? this.options.margin : 0), this.options.height + this.options.margin]
        });
        surf = new Surface({
          size: [this.options.width, this.options.height],
          classes: ['story'],
          properties: {
            backgroundImage: 'url(http://placekitten.com/'+this.options.width+'/'+this.options.height+'?image='+(2*i+j)+')'
          }
        });
        container.add(surf);

        surf = new Surface({
          size: [this.options.width, this.options.height],
          classes: ['story-masker']
        });
        masker = new Modifier({
          opacity: 0
        });
        container.add(masker).add(surf);

        data = {
          author: 'Hina Chen',
          slogan: 'I\'m Hina.'
        };

        surf = new Surface({
          size: [this.options.width / 2, this.options.height / 2],
          classes: ['story-item-content'],
          content: '<h3 class="author">'+data.author+'</h3><hr class="short-line"><h2 class="slogan">'+data.slogan+'</h2>'
        });
        mod = new Modifier({
          origin: [0.5, 0.5]
        });
        container.add(mod).add(surf);

        surf = new Surface({
          size: [this.options.width, this.options.height],
          classes: ['story-masker-trigger']
        });
        surf.on('mouseenter', function(mod, event) {
          mod.setOpacity(1, this.options.transition);
        }.bind(this, masker));
        surf.on('mouseleave', function(mod, event) {
          mod.setOpacity(0, this.options.transition);
        }.bind(this, masker));
        container.add(surf);

        _storiesRow.push(container);
      }

      view.add(storiesRow);

      this.stories.push(view);
    }

    mod = new Modifier({
      origin: [0.5, 0.5]
    });

    this.container.add(mod).add(storiesCol);
    this.container.pipe(this.options.scroller);

    this.add(this.container);
  }

  StoriesView.prototype = Object.create(View.prototype);
  StoriesView.prototype.constructor = StoriesView;

  StoriesView.DEFAULT_OPTIONS = {
    scroller: undefined,
    height: 274,
    width: 400,
    margin: 20,
    sloganHeight: 150,
    total: 10,
    transition: {
      duration: 600,
      curve: 'easeInOut'
    }
  };

  module.exports = StoriesView;
});
