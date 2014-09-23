'use strict';

kp.controller('GalleryCtrl', ['$scope', '$famous', '$window', '$timeout', '$http', '$sce', 'kpapi', '$state', '$stateParams', function($scope, $famous, $window, $timeout, $http, $sce, kpapi, $state, $stateParams) {
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

  console.log('gallery');

  GenericSync.register({
    "mouse" : MouseSync,
    "touch" : TouchSync,
    "scroll": ScrollSync
  });

  var cubeSync = new GenericSync(['mouse', 'touch', 'scroll'], {direction: [GenericSync.DIRECTION_X, GenericSync.DIRECTION_Y]});

  var CUBE_SCROLL_SPEED = .002;
  var DOUBLE_TAP_THRESHOLD = 300;
  var TRANSITIONS = {
    SCALE: {
      duration: 333,
      curve: Easing.outQuint
    },
    ROTATE: {
      duration: 500,
      curve: Easing.outBounce
    }
  };
  var _rotate = new Transitionable([0,0,0]);
  var _scale = new Transitionable([1,1,1]);

  $scope.faces = [
    /*front */ {type: "photo"},
    /*top   */ {type: "title"},
    /*right */ {type: "photo"},
    /*bottom*/ {type: "title"},
    /*left  */ {type: "photo"},
    /*back  */ {type: "photo"},
  ];

  var _lastSyncStartTime = new Date();
  cubeSync.on('start', function() {
    //shrink cube
    _scale.halt();
    _scale.set([.8, .8, .8], TRANSITIONS.SCALE);
  });

  cubeSync.on('update', function(data) {
    var newRotate = _rotate.get();
    newRotate[0] -= data.delta[1] * CUBE_SCROLL_SPEED;
    newRotate[1] += data.delta[0] * CUBE_SCROLL_SPEED * 3;

    _rotate.set.call(_rotate, newRotate);
  });

  cubeSync.on('end', function(data) {
    //handle snapping to nearest facet
    var rotate = _rotate.get().slice(0);

    //ideal rotate values
    var idealX = 0;
    //since there are 4 faces, we want to snap to y-rotations of 0, π/2, π, 3π/2
    var idealY = Math.PI * Math.round(2 * rotate[1] / Math.PI) / 2;

    rotate[0] = idealX;
    rotate[1] = idealY;

    _rotate.set(rotate, TRANSITIONS.ROTATE);
    _scale.halt();
    //grow cube back
    _scale.set([1, 1, 1], TRANSITIONS.SCALE);
  });

  $scope.cubeHandler = new EventHandler();
  $scope.cubeHandler.pipe(cubeSync);

  $scope.galleryHandlers = [$scope.cubeHandler, $scope.scrollHandler];

  $scope.alubmEnter = function(album, $done) {
    album.scale.set([1, 1, 1], {duration: 1000, curve: Easing.outElastic});
    album.opacity.set(1, {duration: 1250, curve: "linear"}, $done);
  };

  $scope.getRotate = function() {
    return _rotate.get();
  };
  $scope.getScale = function() {
    return _scale.get();
  };
  $scope.scrollTranslate = function() {
    if ($window.innerWidth > 480) {
      return [($window.innerWidth - 480) / 2, 0, 0];
    } else {
      return [0, 0, 0];
    }
  };
  $scope.cubeSize = function() {
    if ($window.innerWidth > 480) {
      return [480, 480];
    } else {
      return [$window.innerWidth, $window.innerWidth];
    }
  };
  $scope.getDimensions = function() {
    if ($window.innerWidth > 480) {
      return [480, 480, 480];
    } else {
      return [$window.innerWidth, $window.innerWidth, $window.innerWidth];
    }
  };
  $scope.getInitTranslate = function() {
    if ($window.innerWidth > 480) {
      return [-240, -240, 240];
    } else {
      return [($window.innerWidth / 2) * -1, ($window.innerWidth / 2) * -1, ($window.innerWidth / 2)];
    }
  };
  $scope.verticalAlign = function() {
    if ($window.innerWidth > 480) {
      return 'height: 480px; margin-top: -240px;';
    } else {
      return 'height: '+$window.innerWidth+'px; margin-top: -'+($window.innerWidth / 2)+'px;';
    }
  };
  $scope.getCuboidProperties = function(face_index, n) {
    var url;
    switch(face_index) {
      case 0: /* front */
        url = $scope.gallery.front[n] === undefined ? undefined : $scope.gallery.front[n].thumbnails.medium;
      break;
      case 2: /* right */
        url = $scope.gallery.right[n] === undefined ? undefined : $scope.gallery.right[n].thumbnails.medium;
      break;
      case 4: /* left */
        url = $scope.gallery.left[n] === undefined ? undefined : $scope.gallery.left[n].thumbnails.medium;
      break;
      case 5: /* back */
        url = $scope.gallery.back[n] === undefined ? undefined : $scope.gallery.back[n].thumbnails.medium;
      break;
    }

    if (url === undefined) {
      return {
        backgroundImage: 'none'
      };
    } else {
      return {
        backgroundImage: 'url('+url+')'
      };
    }
  };
  $scope.goAlbum = function(face_index, n) {
    var album_id;
    switch(face_index) {
      case 0: /* front */
        album_id = $scope.gallery.front[n] === undefined ? undefined : $scope.gallery.front[n].id;
      break;
      case 2: /* right */
        album_id = $scope.gallery.right[n] === undefined ? undefined : $scope.gallery.right[n].id;
      break;
      case 4: /* left */
        album_id = $scope.gallery.left[n] === undefined ? undefined : $scope.gallery.left[n].id;
      break;
      case 5: /* back */
        album_id = $scope.gallery.back[n] === undefined ? undefined : $scope.gallery.back[n].id;
      break;
    }
    var currentTime = new Date();

    if(currentTime - _lastSyncStartTime < DOUBLE_TAP_THRESHOLD && album_id !== undefined) {
      $state.go('root.photos', { album_id: album_id }, { location: 'replace', notify: true });
    }
    _lastSyncStartTime = currentTime;
  };
  $scope.getAlbumTitle = function(face_index, n) {
    var title;
    switch(face_index) {
      case 0: /* front */
        title = $scope.gallery.front[n] === undefined ? undefined : $scope.gallery.front[n].title;
      break;
      case 2: /* right */
        title = $scope.gallery.right[n] === undefined ? undefined : $scope.gallery.right[n].title;
      break;
      case 4: /* left */
        title = $scope.gallery.left[n] === undefined ? undefined : $scope.gallery.left[n].title;
      break;
      case 5: /* back */
        title = $scope.gallery.back[n] === undefined ? undefined : $scope.gallery.back[n].title;
      break;
    }
    return title === undefined && '' || title;
  };

  $scope.galleryRepeatRange = 0;

  if ($scope.cache.gallery.front.length === 0
    || $scope.cache.gallery.back.length === 0
    || $scope.cache.gallery.right.length === 0
    || $scope.cache.gallery.left.length === 0) {
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
      $scope.galleryRepeatRange = Math.round(i / 4);
    });
    promise.error(function(data) {
      console.log("API ERROR!", arguments);
    });
  } else {
    console.log('CACHED!');
    $scope.gallery = $scope.cache.gallery;
    $scope.galleryRepeatRange = Math.max(
      $scope.cache.gallery.front.length,
      $scope.cache.gallery.back.length,
      $scope.cache.gallery.left.length,
      $scope.cache.gallery.right.length
    );
  }
}]);
