define(function(require, exports, module) {
  var Surface              = require('famous/core/Surface');
  var Modifier             = require('famous/core/Modifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');
  var ContainerSurface     = require('famous/surfaces/ContainerSurface');
  var Utility              = require('famous/utilities/Utility');
  var ScrollView           = require('famous/views/Scrollview');
  var GridLayout           = require('famous/views/GridLayout');
  var SequentialLayout     = require('famous/views/SequentialLayout');

  function StoriesView() {
    View.apply(this, arguments);

    this.stories = [];
    this.maskers = [];
    this._maskerTimer = undefined;

    _createStories.call(this);
  }

  function _createStories() {

    this.container = new ContainerSurface({
      size: [undefined, (this.options.height + this.options.margin) * (this.options.total / 2) + this.options.sloganHeight],
      classes: ['stories-container']
    });

    var grid = [], surf, mod, container, view, data, masker;

    var storiesContent = new SequentialLayout({
      direction: Utility.Direction.Y
    });
    storiesContent.sequenceFrom(grid);

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

    mod = new Modifier({
      origin: [0.5, 0]
    });
    this.container.add(mod).add(container);

    grid.push(container);

    var gridLayout = new GridLayout({
      dimensions: [2, 5],
      cellSize: [this.options.width, this.options.height + this.options.margin]
    });
    gridLayout.sequenceFrom(this.stories);

    for (var j = 0; j < this.options.total; j++) {
      container = new ContainerSurface({
        size: [this.options.width, this.options.height + this.options.margin]
      });
      surf = new Surface({
        size: [this.options.width, this.options.height],
        classes: ['story'],
        properties: {
          backgroundImage: 'url(http://placekitten.com/'+this.options.width+'/'+this.options.height+'?image='+j+')'
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
      this.maskers.push(masker);
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
      surf.on('mouseenter', function(key, event) {
        if (this._maskerTimer !== undefined) clearTimeout(this._maskerTimer);
        this._maskerTimer = setTimeout(function(key) {
          this.maskers[key].setOpacity(1, this.options.transition);
        }.bind(this, key), 300);
      }.bind(this, j));
      surf.on('mouseleave', function(key, event) {
        if (this._maskerTimer !== undefined) clearTimeout(this._maskerTimer);
        this.maskers[key].setOpacity(0, this.options.transition);
      }.bind(this, j));
      container.add(surf);

      view = new View();
      view.add(container);

      this.stories.push(view);
    }

    container = new ContainerSurface({
      size: [this.options.width * 2 + this.options.margin, (this.options.height + this.options.margin) * (this.options.total / 2)]
    });
    mod = new Modifier({
      origin: [0.5, 0.9]
    });
    container.add(gridLayout);

    this.container.add(mod).add(container);
    //this.container.pipe(this.options.scroller);

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
