define(function(require, exports, module) {
  var Surface              = require('famous/core/Surface');
  var Modifier             = require('famous/core/Modifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');
  var ContainerSurface     = require('famous/surfaces/ContainerSurface');
  var ScrollExtension      = require('views/ScrollExtension');

  function MenuView() {
    View.apply(this, arguments);

    this.items = [];

    _createMenu.call(this);

    this.toggleMenu = toggleMenu;
  }

  function _createMenu() {
    this.container = new ContainerSurface({
      classes: ['menu-container']
    });
    this.scrollView = new ScrollExtension({
      margin: 1000000
    });
    this.scrollView.sequenceFrom(this.items);
    this.container.add(this.scrollView);

    var containerSurface, surf, mod;

    containerSurface = new ContainerSurface({
      size: [undefined, this.options.lineHeight + this.options.originY * 2],
      properties:{
        overflow: 'hidden'
      }
    });
    mod = new Modifier({
      origin: [0, 0.5],
      transform: Transform.translate(this.options.originX, this.options.originY, 0)
    });
    surf = new Surface({
      size: [undefined, this.options.lineHeight],
      classes: ['menu-items', 'text-uppercase'],
      content: '<a href="#">Home</a>',
      properties:{
        lineHeight: this.options.lineHeight + 'px'
      }
    });
    containerSurface.add(mod).add(surf);
    containerSurface.pipe(this.scrollView);

    this.items.push(containerSurface);

    containerSurface = new ContainerSurface({
      size: [undefined, this.options.lineHeight],
      properties:{
        overflow: 'hidden'
      }
    });
    mod = new Modifier({
      origin: [0, 0.5],
      transform: Transform.translate(this.options.originX, 0, 0)
    });
    surf = new Surface({
      size: [undefined, this.options.lineHeight],
      classes: ['menu-items', 'text-uppercase'],
      content: '<a href="#">Login</a>',
      properties:{
        lineHeight: this.options.lineHeight + 'px'
      }
    });
    containerSurface.add(mod).add(surf);
    containerSurface.pipe(this.scrollView);

    this.items.push(containerSurface);

    containerSurface = new ContainerSurface({
      size: [undefined, this.options.lineHeight + this.options.originY * 1.6],
      properties:{
        overflow: 'hidden'
      }
    });
    mod = new Modifier({
      origin: [0, 0.5],
      transform: Transform.translate(this.options.originX, this.options.originY * 0.8, 0)
    });
    surf = new Surface({
      size: [undefined, this.options.lineHeight],
      classes: ['menu-items', 'text-uppercase'],
      content: '<a href="#">About</a>',
      properties:{
        lineHeight: this.options.lineHeight + 'px'
      }
    });
    containerSurface.add(mod).add(surf);
    containerSurface.pipe(this.scrollView);

    this.items.push(containerSurface);

    containerSurface = new ContainerSurface({
      size: [undefined, this.options.lineHeight],
      properties:{
        overflow: 'hidden'
      }
    });
    mod = new Modifier({
      origin: [0, 0.5],
      transform: Transform.translate(this.options.originX, 0, 0)
    });
    surf = new Surface({
      size: [undefined, this.options.lineHeight],
      classes: ['menu-items', 'text-uppercase'],
      content: '<a href="#">Feedback</a>',
      properties:{
        lineHeight: this.options.lineHeight + 'px'
      }
    });
    containerSurface.add(mod).add(surf);
    containerSurface.pipe(this.scrollView);

    this.items.push(containerSurface);

    containerSurface = new ContainerSurface({
      size: [undefined, this.options.lineHeight + this.options.originY * 1.6],
      properties:{
        overflow: 'hidden'
      }
    });
    surf = new Surface({
      size: [undefined, this.options.lineHeight],
      classes: ['menu-items', 'find-us-on', 'text-uppercase'],
      content: 'find us on',
      properties:{
        lineHeight: this.options.lineHeight + 'px'
      }
    });
    mod = new Modifier({
      origin: [0, 0.5],
      transform: Transform.translate(this.options.originX, this.options.originY * 0.8, 0)
    });
    containerSurface.add(mod).add(surf);
    containerSurface.pipe(this.scrollView);

    this.items.push(containerSurface);

    containerSurface = new ContainerSurface({
      size: [undefined, 36],
      properties:{
        overflow: 'hidden'
      }
    });

    var socialIcons = ['<a href="#"><i class="fa fa-facebook-square"></i></a>','<a href="#"><i class="blog-medium">M</i></a>', '<a href="#"><i class="fa fa-instagram"></i></a>', '<a href="#"><i class="fa fa-twitter"></i></a>'];
    for (var i = 0; i < 4; i++) {
      surf = new Surface({
        size: (i === 1 ? [31, 31] : [36, 36]),
        classes: (i === 1 ? ['social-icons', 'blog-medium'] : ['social-icons']),
        content: socialIcons[i],
        properties: {
          fontSize: (i === 1 ? '18px' : '36px'),
          lineHeight: (i === 1 ? '32px' : '36px'),
          marginLeft: (i === 1 ? '2px' : '0px'),
          marginTop: (i === 1 ? '2px' : '0px'),
          paddingLeft: (i === 1 ? '1px' : '0px')
        }
      });
      mod = new Modifier({
        origin: [0, 0],
        transform: Transform.translate(this.options.originX + (i * 40), 0, 0)
      });
      containerSurface.add(mod).add(surf);
    }
    containerSurface.pipe(this.scrollView);

    this.items.push(containerSurface);

    mod = new Modifier({
      origin: [0.5, 1]
    });

    surf = new Surface({
      size: [this.options.width * 3 / 4, 72],
      classes: ['copyright'],
      content: '&copy; 2014 Rinse, Inc. All rights reserved.'
    });

    this.container.add(mod).add(surf);

    this.mod = new Modifier({
      size: [this.options.width, undefined],
      transform: Transform.translate(this.options.width * -1, 0, 0)
    });

    this._add(this.mod).add(this.container);


    // Menu trigger button
    containerSurface = new ContainerSurface({
      size: [this.options.width / 3, this.options.lineHeight],
    });

    mod = new Modifier({
      transform: Transform.translate(this.options.originX * 2.5, this.options.originY * 2, 0)
    });

    surf = new Surface({
      size: [this.options.width / 2.5, this.options.lineHeight],
      classes: ['menu-toggle-button', 'text-uppercase'],
      content: '<i class="fa fa-bars"></i>&nbsp;Menu',
      properties:{
        lineHeight: this.options.lineHeight + 'px'
      }
    });
    containerSurface.add(mod).add(surf);

    containerSurface.on('click', function() {
      toggleMenu.call(this);
    }.bind(this));

    mod = new Modifier({
      origin: [1, 0]
    });

    this.container.add(mod).add(containerSurface);
  }

  function toggleMenu() {
    var size = this.mod.getSize();

    this.mod.setTransform(
      Transform.translate(this.options.show ? size[0] * -1 : 0, 0, 0),
      this.options.transition,
      function() {
        this.options.show = !this.options.show;
      }.bind(this)
    );
    this.options.containerMod.setTransform(
      Transform.translate(this.options.show ? 0 : size[0], 0, 0),
      this.options.transition
    );
  }

  MenuView.prototype = Object.create(View.prototype);
  MenuView.prototype.constructor = MenuView;

  MenuView.DEFAULT_OPTIONS = {
    originX: 36,
    originY: 24,
    lineHeight: 24,
    width: 250,
    transition: {
      duration: 100,
      curve: 'easeInOut'
    },
    show: false,
    containerMod: undefined
  };

  module.exports = MenuView;
});
