define(function(require, exports, module) {
  var Surface              = require('famous/core/Surface');
  var StateModifier        = require('famous/modifiers/stateModifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');

  var ScrollViewExtension  = require('views/ScrollViewExtension');
  var RowView              = require('views/RowView');
  var ContainerSurface     = require('famous/surfaces/ContainerSurface');

  function PhotosView() {
    View.apply(this, arguments);

    _createContent.call(this);
    this.createPhotoRowView = createPhotoRowView;
  }

  PhotosView.prototype = Object.create(View.prototype);
  PhotosView.prototype.constructor = PhotosView;

  PhotosView.DEFAULT_OPTIONS = {
    height: null,
    width: null,
    loadingBanner: null,
    page: 1,
    perpage: 36,
    raw: []
  };

  function _createContent() {
    this._500px = _500px;

    // Get the popular photos from 500px
    this._500px.init({
      sdk_key: '526ab44aa14a6cfe0d48c1538b7643e653f71fe2'
    });

    _loading500px.call(this);
  }

  function _loading500px() {
    this._500px.api('/photos', { feature: 'upcoming', page: this.options.page, rpp: this.options.perpage, image_size: 3 }, function(response) {
      var photos = response.data.photos;

      // Save the raw data in this object
      for (var i=0; i< photos.length; i++) {
        this.options.raw.push(photos[i]);
      }

      this.rowViews = []; // Maintain reference to rowViews for animation
      this.views = [];

      this.scrollView = new ScrollViewExtension({
          edgeLoaded: true,
          photoView: this,
          loadingBanner: this.options.loadingBanner
      });

      this.scrollView.sequenceFrom(this.views);

      var container = new ContainerSurface({
        classes: ['photo-scroll-container'],
        size: [this.options.width, this.options.height],
        properties:{
            overflow: 'hidden'
        }
      });

      var mod = new StateModifier({
        origin: [0.5, 0]
      });

      createPhotoRowView.call(this, photos);

      container.add(this.scrollView);
      this._add(mod).add(container);

      setTimeout(function() {
        this.options.loadingBanner.hide();
      }.bind(this), 500);
    }.bind(this));
  }

  function createPhotoRowView(photos) {
    var photos = photos, rowView, count = 0;
    var paging = this.options.width >= 900 ? 4 : this.options.width >= 600 ? 3 : 1;

    for(var row = 0; row < (photos.length / paging); row++) {
      rowView = new RowView({
        scrollView: this.scrollView,
        count: count,
        paging: paging,
        photoSize: this.options.width / paging,
        photos: (function(photos) {
          var rowPhotos = [];
          for(var i = row*paging; i < (row*paging + paging); i++) {
            rowPhotos.push(photos[i]);
          }
          return rowPhotos;
        })(photos)
      });

      this.rowViews.push(rowView);

      this.views.push(rowView.sequentialLayout);
      count += 5;
    }
  }

  module.exports = PhotosView;
});
