define(function(require, exports, module) {
  var Surface              = require('famous/core/Surface');
  var StateModifier        = require('famous/modifiers/StateModifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');
  var SequentialLayout     = require('famous/views/SequentialLayout');
  var ContainerSurface     = require('famous/surfaces/ContainerSurface');

  var StateModifier        = require('famous/modifiers/StateModifier');
  var Easing               = require('famous/transitions/Easing');

  function RowView(options) {
    this.options = options;
    this.options.transition = {
        duration: 600,
        curve: 'easeInOut'
    }

    _createPhotoContainer.call(this);
    _createContent.call(this);
    this.animateIn = animateIn;
    this.reset = reset;
    this.sequentialLayout.rowView = this;

    //this.animateIn();
  }

  function _createContent() {
    this.sequentialLayout = new SequentialLayout({
      direction: 0
    });

    this.sequentialLayout.sequenceFrom(this.views);
  }

  function _createPhotoContainer() {
    this.views = [];
    this.mods = [];

    var surf, view, offset, mod, container, eventHandler;
    var photos = this.options.photos,
    imgSize, imgProperties, imgContent;

    for(var i = 0; i < this.options.paging; i++) {
      if (photos[i] === undefined) return true;
      imgSize = this.options.photoSize - 4;
      imgProperties = {
        width: imgSize,
        height: imgSize,
        backgroundImage: "url("+photos[i].image_url+")",
        backgroundSize: photos[i].width > photos[i].height ? "auto 100%" : "100% auto"
      };

      imgContent = '<h1 class="title"><a href="//500px.com'+photos[i].url+'" target="_blank">'+photos[i].name+'</a></h1><author class="author">'+photos[i].user.fullname+'</author>';

      offset = imgSize * (i+1) * -1;

      /**
       * Photo Container
       */
      container = new ContainerSurface({
        size: [this.options.photoSize, this.options.photoSize],
        classes: ['photo-container'],
        properties:{
            overflow: 'hidden'
        }
      });
      container.shareLink = [];
      container.timing = null;

      mod = new StateModifier({
        transform: Transform.translate(0, 0, 0),
        opacity: 1
      });
      mod.offset = offset;
      this.mods.push(mod);

      view = new View();

      container.add(mod).add(view);

      /**
       * Photo surface
       */
      surf = new Surface({
        classes: ['photos'],
        content: '',
        properties: imgProperties
      });

      view.add(surf);

      /**
       * Photo title and Author info
       */
      surf = new Surface({
        size: [(this.options.photoSize / 4) * 3 - 2/* CSS margin */, 14 * 5],
        classes: ['photo-title-and-author'],
        content: imgContent
      });
      mod = new StateModifier({
        transform: Transform.translate(2/* CSS margin */, -2/* CSS margin */, 0),
        origin: [0, 1]
      });
      view._add(mod).add(surf);

      /**
       * Photo Rating
       */
      surf = new Surface({
        size: [this.options.photoSize / 4 - 2/* CSS margin */, 14 * 5],
        classes: ['photo-rank'],
        content: '<span class="table-wrapper"><span class="table-cell">'+photos[i].rating+'</span></span>'
      });
      mod = new StateModifier({
        transform: Transform.translate(-2/* CSS margin */, -2/* CSS margin */, 0),
        origin: [1, 1]
      });
      view._add(mod).add(surf);

      /**
       * Facebook, Twitter and Google plus Social Network share
       */
      var shareLink = '';
      (['pinterest', 'twitter', 'facebook']).forEach(function(name, key) {
        if (name === 'pinterest') {
          shareLink = 'http://pinterest.com/pin/create/link/?url='+encodeURIComponent('http://500px.com'+photos[i].url)
        } else if (name === 'twitter') {
          shareLink = 'https://twitter.com/share?url='+encodeURIComponent('http://500px.com'+photos[i].url)
        } else if (name === 'facebook') {
          shareLink = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('http://500px.com'+photos[i].url)
        } else {
          shareLink = '#';
        }
        surf = new Surface({
          size: [imgSize / 6, imgSize / 6],
          classes: ['social-'+name, 'social-network-share'],
          content: '<a href="'+shareLink+'" target="_blank"></a>'
        });
        mod = new StateModifier({
          transform: Transform.translate((imgSize / 6 + 4) * key * -1 - 10, imgSize * -3, 0),
          origin: [1, 0]
        });
        container.shareLink.push(mod);

        view._add(mod).add(surf);
      }.bind(this));

      /**
       * Mouse Event on the social network modifier
       */
      container.on('mouseenter', function() {
        this.timing = setTimeout(function() {
          if (this.timing == null) return false;
          for(var x = 0; x < this.shareLink.length; x++) {
            this.shareLink[x].setTransform(
              Transform.translate((imgSize / 6 + 4) * x * -1 - 10, 10, 0),
              { duration: 300 }
            );
          }
        }.bind(this), 250);
      });
      container.on('mouseleave', function() {
        this.timing = null;
        for(var x = 0; x < this.shareLink.length; x++) {
          this.shareLink[x].setTransform(
            Transform.translate((imgSize / 6 + 4) * x * -1 - 10, imgSize * -3, 0),
            { duration: 100 }
          );
        }
      });

      /**
       * Pipe the container to scrollView, enhance the prerender EventHandler on Famous Engine
       */
      container.pipe(this.options.scrollView);
      this.views.push(container);

      //this.options.count++;
    }
  }

  function reset() {
    for(var i = 0; i < this.mods.length; i++) {
      this.mods[i].setTransform(
        Transform.translate(this.mods[i].offset, 0, 0),
        this.options.transition
      );
      this.mods[i].setOpacity(0.1, this.options.transition);
    }
  }

  function animateIn() {
    for(var i = 0; i < this.mods.length; i++) {
      this.mods[i].setTransform(
        Transform.translate(0, 0, 0),
        this.options.transition
      );
      this.mods[i].setOpacity(1, this.options.transition);
    }
  }

  module.exports = RowView;
});
