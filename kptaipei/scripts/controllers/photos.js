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
      duration: 800,
      curve: Easing.outQuint
    },
    SCALE: {
      duration: 666,
      curve: Easing.outBounce
    }
  };
  var album_id = $stateParams['album_id'];
  var _rotate = new Transitionable([0,0,0]);
  var _scale = new Transitionable([0,0,0]);

  var photoSync = new GenericSync(['mouse', 'touch', 'scroll'], {direction: [GenericSync.DIRECTION_X, GenericSync.DIRECTION_Y]});
  var _lastSyncStartTime = new Date();
  photoSync.on('start', function() {
    _scale.halt();
    _scale.set([.8, .8, .8], TRANSITIONS.SCALE);
  });
  photoSync.on('update', function(data) {
    var newRotate = _rotate.get();
    newRotate[0] += data.delta[1] * .001;
    newRotate[1] -= data.delta[0] * .001;
    newRotate[2] += data.delta[1] * .001;

    newRotate[0] = newRotate[0] > 1 ? 1 : newRotate[0] < -1 ? -1 : newRotate[0];
    newRotate[1] = newRotate[1] > 1 ? 1 : newRotate[1] < -1 ? -1 : newRotate[1];
    newRotate[2] = newRotate[2] > 1 ? 1 : newRotate[2] < -1 ? -1 : newRotate[2];

    _rotate.set.call(_rotate, newRotate);
  });
  photoSync.on('end', function() {
    _rotate.halt();
    _rotate.set([0, 0, 0], TRANSITIONS.ROTATE);
    _scale.set([1, 1, 1], TRANSITIONS.SCALE);
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
  $scope.getScale = function() {
    return _scale.get();
  };
  $scope.photoEnter = function(photo, $done) {
    photo.scale.set([1, 1, 1], {duration: 1000, curve: Easing.outElastic});
    photo.opacity.set(1, {duration: 1250, curve: "linear"}, $done);
  };

  $scope.photoHandler = new EventHandler();
  $scope.photoHandler.pipe(photoSync);
  $scope.photoHandlers = [$scope.photoHandler, $scope.scrollHandler];

  function getPhotos(album_id) {
    var key = $scope.cache.gallery.sets[album_id].key,
        type = $scope.cache.gallery.sets[album_id].type;
    if ($scope.cache.gallery[type][key].photos.length === 0) {
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
        $scope.cache.gallery[type][key].photos = photos;
        $scope.photos = photos;
        console.log(photos);
      });
      promise.error(function(data) {
        console.log("API ERROR!", arguments);
      });
    } else {
      $scope.photos = $scope.cache.gallery[type][key].photos;
    }
  }

  if ($scope.cache.gallery.sets[album_id] === undefined) {
    $scope.gallery = $scope.cache.gallery;
    var promise = kpapi.getAlbums();
    promise.success(function(data) {
      var i = 0;
      _.map(data.data, function(album) {
        var gallery = _.extend(album, {
          scale: new Transitionable([.001, .001, .001]),
          opacity: new Transitionable(0),
          photos: []
        });
        switch(i % 4) {
          case 0:
            $scope.gallery.front.push(gallery);
            $scope.gallery.sets[album.id] = {
              type: 'front',
              key: $scope.gallery.front.length - 1
            };
          break;
          case 1:
            $scope.gallery.right.push(gallery);
            $scope.gallery.sets[album.id] = {
              type: 'right',
              key: $scope.gallery.right.length - 1
            };
          break;
          case 2:
            $scope.gallery.left.push(gallery);
            $scope.gallery.sets[album.id] = {
              type: 'left',
              key: $scope.gallery.left.length - 1
            };
          break;
          case 3:
            $scope.gallery.back.push(gallery);
            $scope.gallery.sets[album.id] = {
              type: 'back',
              key: $scope.gallery.back.length - 1
            };
          break;
        }
        i++;
      });
      console.log($scope.gallery);
      $scope.cache.gallery = $scope.gallery;
      getPhotos(album_id);
    });
    promise.error(function(data) {
      console.log("API ERROR!", arguments);
    });
  } else {
    console.log('CACHED!');
    getPhotos(album_id);
  }
}]);