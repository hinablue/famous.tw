'use strict';

kp.controller('HomepageCtrl', ['$scope', '$famous', '$window', '$timeout', '$http', '$sce', 'kpapi', '$state', '$stateParams', function($scope, $famous, $window, $timeout, $http, $sce, kpapi, $state, $stateParams) {
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
    {type: "photo"},
    {type: "photo"},
    {type: "title"},
    {type: "photo"},
    {type: "title"},
    {type: "photo"},
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
    newRotate[1] += data.delta[0] * CUBE_SCROLL_SPEED;

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
  $scope.cubeHandler.on('click', function(event) {
    var currentTime = new Date();

    if(currentTime - _lastSyncStartTime < DOUBLE_TAP_THRESHOLD) {
      $scope.handleDoubleTap(event);
    }
    _lastSyncStartTime = currentTime;
  });
  $scope.cubeHandler.pipe(cubeSync);

  $scope.galleryHandlers = [$scope.cubeHandler, $scope.scrollHandler];

  $scope.coverContentSize = function() {
    if ($window.innerWidth > 1020) {
      return [($window.innerWidth - 500), undefined];
    } else {
      return [undefined, 480];
    }
  };
  $scope.coverContentTranslate = function() {
    if ($window.innerWidth > 1020) {
      return [500, -480, 0];
    } else {
      return [0, 10, 0];
    }
  };

  $scope.getRotate = function() {
    return _rotate.get();
  };
  $scope.getScale = function() {
    return _scale.get();
  };
  $scope.scrollTranslate = function() {
    if ($window.innerWidth > 480) {
      return [10, 10, 0];
    } else {
      return [0, 0, 0];
    }
  };
  $scope.cubeResize = function() {
    if ($window.innerWidth > 1020) {
      return [480, 480];
    } else {
      return [undefined, undefined];
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
  $scope.cover = {
    properties: {
      backgroundImage: 'url(./imgs/kp.png)'
    },
  };
}]);