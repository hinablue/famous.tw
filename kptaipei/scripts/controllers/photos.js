'use strict';

kp.controller('PhotosCtrl', ['$scope', '$famous', '$window', '$timeout', '$http', '$sce', 'kpapi', '$state', '$stateParams', function($scope, $famous, $window, $timeout, $http, $sce, kpapi, $state, $stateParams) {
  var GenericSync = $famous['famous/inputs/GenericSync'],
      EventHandler = $famous['famous/core/EventHandler'],
      ElementAllocator = $famous['famous/core/ElementAllocator'],
      View = $famous['famous/core/View'];

  var Transitionable = $famous['famous/transitions/Transitionable'],
      Easing = $famous['famous/transitions/Easing'],
      MouseSync = $famous["famous/inputs/MouseSync"],
      TouchSync = $famous["famous/inputs/TouchSync"],
      ScrollSync = $famous["famous/inputs/ScrollSync"],
      Timer = $famous['famous/utilities/Timer'];

  console.log('photos');

  GenericSync.register({
    "mouse" : MouseSync,
    "touch" : TouchSync,
    "scroll": ScrollSync
  });

  var PHOTO_SCROLL_SPEED = .005;
  var TRANSITIONS = {
    ROTATE: {
      duration: 333,
      curve: Easing.outBounce
    }
  };
  var album_id = $stateParams['album_id'];
  var _rotate = new Transitionable([0,0,0]);

  var photoSync = new GenericSync(['mouse', 'touch', 'scroll'], {direction: [GenericSync.DIRECTION_X, GenericSync.DIRECTION_Y]});
  var _lastSyncStartTime = new Date();
  photoSync.on('start', function() {
    _rotate.halt();
    _rotate.set([0, 0, .2], TRANSITIONS.ROTATE);
  });

  photoSync.on('end', function(data) {
    _rotate.halt();
    _rotate.set([0, 0, 0], TRANSITIONS.ROTATE);
  });

  $scope.backToGallery = function() {
    $state.go('root.gallery', {}, { location: 'replace', notify: true });
  };

  $scope.photoSize = function() {
    if ($window.innerWidth > 640) {
      return [640, 640];
    } else {
      return [$window.innerWidth, $window.innerWidth];
    }
  };
  $scope.scrollTranslate = function() {
    if ($window.innerWidth > 640) {
      return [($window.innerWidth - 640) / 2, 0, 0];
    } else {
      return [0, 0, 0];
    }
  };
  $scope.getRotate = function() {
    return _rotate.get();
  };
  $scope.photoEnter = function(photo, $done) {
    photo.scale.set([1, 1, 1], {duration: 1000, curve: Easing.outElastic});
    photo.opacity.set(1, {duration: 1250, curve: "linear"}, $done);
  };

  $scope.photoHandler = new EventHandler();
  $scope.photoHandler.pipe(photoSync);
  $scope.photoHandlers = [$scope.photoHandler, $scope.scrollHandler];

  function getPhotos() {
    if ($scope.cache.gallery[album_id].photos.length === 0) {
      var photos = [];
      var promise = kpapi.getPhotos(album_id);
      promise.success(function(data) {
        photos = _.map(data.data.photos, function(photo) {
          return _.extend(photo, {
            scale: new Transitionable([.001, .001, .001]),
            opacity: new Transitionable(0),
            properties: {
              backgroundImage: 'url('+photo.images.medium+')'
            },
          });
        });
        $scope.cache.gallery[album_id].photos = photos;
        $scope.photos = photos;
        console.log(photos);
      });
      promise.error(function(data) {
        console.log("API ERROR!", arguments);
      });
    } else {
      $scope.photos = $scope.cache.gallery[album_id].photos;
    }
  }

  if ($scope.cache.gallery[album_id] === undefined) {
    var gallery = {};
    var promise = kpapi.getAlbums();
    promise.success(function(data) {
      _.map(data.data, function(album) {
        gallery[album.id] = _.extend(album, {
          scale: new Transitionable([.001, .001, .001]),
          opacity: new Transitionable(0),
          properties: {
            backgroundImage: 'url('+album.thumbnails.medium+')'
          },
          photos: []
        });
      });
      $scope.cache.gallery = gallery;
      getPhotos();
    });
    promise.error(function(data) {
      console.log("API ERROR!", arguments);
      $state.go('root.gallery', { location: 'replace' });
    });
  } else {
    console.log('CACHED!');
    getPhotos();
  }
}]);