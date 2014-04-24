define(function(require, exports, module) {
  var FamousEngine         = require('famous/core/Engine');
  var ScrollView           = require('famous/views/Scrollview');

  var PhotosView           = require('views/PhotosView');
  var RowView              = require('views/RowView');
  var LoadingBannerView    = require('views/LoadingBannerView');

  function ScrollViewExtension() {
    ScrollView.apply(this, arguments);

    this.enableEdgeLoaded = enableEdgeLoaded;
    this.disableEdgeLoaded = disableEdgeLoaded;

    _monitorOffsets.call(this);
    _monitorEdge.call(this);
  }

  ScrollViewExtension.prototype = Object.create(ScrollView.prototype);
  ScrollViewExtension.prototype.constructor = ScrollViewExtension;

  ScrollViewExtension.DEFAULT_OPTIONS = {
    edgeLoaded: false,
    photoView: null,
    loadingBanner: null
  };

  var displayed = {};
  function _monitorOffsets() {
    FamousEngine.on('prerender', function(){
      var newDisplay = {};
      var node = this._node.getPrevious() || this._node;

      for (var i = node.index; i < node.index + 15; i++) {
        newDisplay[i] = true;
        if(!displayed[i] && node._.array[i]) {
          // new item --> animate
          node._.array[i].rowView.animateIn();
        }
      }
      // reset items that have left viewport
      for(var row in displayed) {
        if(!(row in newDisplay) && node._.array[row]) {
          node._.array[row].rowView.reset();
        }
      }
      displayed = newDisplay;
    }.bind(this));
  }

  function _monitorEdge() {
    this._scroller.on('edgeHit', function(data) {
      this._edgeSpringPosition = data.position;

      if (data.position < 0 && true === this.options.edgeLoaded) {
        disableEdgeLoaded.call(this);

        var photoView = this.options.photoView;
        var loadingBanner = this.options.loadingBanner;

        loadingBanner.show();
        photoView.options.page++;
        photoView._500px.api('/photos', { feature: 'upcoming', page: photoView.options.page, rpp: photoView.options.perpage, image_size: 3 }, function(response) {
          var photos = response.data.photos;

          // Save the raw data in this object
          for (var i=0; i< photos.length; i++) {
            photoView.options.raw.push(photos[i]);
          }

          photoView.createPhotoRowView.call(photoView, photos);

          setTimeout(function() {
            enableEdgeLoaded.call(this);
            loadingBanner.hide();
          }.bind(this), 800);
        }.bind(this));
      }
    }.bind(this));
  }

  function enableEdgeLoaded() {
    this.options.edgeLoaded = true;
  }

  function disableEdgeLoaded() {
    this.options.edgeLoaded = false;
  }

  module.exports = ScrollViewExtension;
});
