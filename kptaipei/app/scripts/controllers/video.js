'use strict';

kp.controller('VideoCtrl', ['$scope', '$famous', '$window', '$timeout', '$http', '$sce', 'kpapi', '$state', '$stateParams', function($scope, $famous, $window, $timeout, $http, $sce, kpapi, $state, $stateParams) {
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

  console.log('video');

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
  var video_id = $stateParams['video_id'];
  var _rotate = new Transitionable([0, 0, 0]);

  var videoSync = new GenericSync(['mouse', 'touch', 'scroll'], {direction: [GenericSync.DIRECTION_X, GenericSync.DIRECTION_Y]});
  var _lastSyncStartTime = new Date();
  videoSync.on('start', function() {
    _rotate.halt();
    _rotate.set([.1, .5, 0], TRANSITIONS.ROTATE);
  });

  videoSync.on('end', function(data) {
    _rotate.halt();
    _rotate.set([0, 0, 0], TRANSITIONS.ROTATE);
  });

  $scope.backToVideos = function() {
    $state.go('root.videos', {}, { location: 'replace', notify: true });
  };
  $scope.videoSize = function() {
    if ($window.innerWidth > 640) {
      return [640, 640];
    } else {
      return [$window.innerWidth - 20, $window.innerWidth - 20];
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
  $scope.videoEnter = function(photo, $done) {
    photo.scale.set([1, 1, 1], {duration: 1000, curve: Easing.outElastic});
  };

  $scope.videoHandler = new EventHandler();
  $scope.videoHandler.pipe(videoSync);
  $scope.videoHandlers = [$scope.videoHandler, $scope.scrollHandler];

  function getCurrentVideo(videoParent) {
    if (videoParent === undefined) {
      for (var i = 0, k = $scope.videoParent, l = k.length; i < l; ++i) {
        if (k[i].id === video_id) {
          videoParent = k[i];
          break;
        }
      }

      if (videoParent !== undefined) {
        $scope.videos = videoParent.video;
      } else {
        console.log("VIDEO ERROR!", arguments);
        $state.go('root.home', { location: 'replace' });
      }
    } else {
      $scope.videos = videoParent.video;
    }
  }

  var videosList = [];
  function getVideos(index) {
    var promise = kpapi.getVideo(videosList[index].id);
    promise.success(function(data) {
      videosList[index].video = _.map(data.data, function(video) {
        return _.extend(video, {
          scale: new Transitionable([.001, .001, .001]),
          datetime: new Date(video.publishedAt),
          link: video.link.replace('watch?v=', 'embed/'),
          getWidth: function() {
            if ($window.innerWidth > 560) {
              return 560;
            } else {
              return $window.innerWidth - 40;
            }
          },
          getHeight: function() {
            if ($window.innerWidth > 560) {
              return 315;
            } else {
              return ($window.innerWidth - 40) * 315 / 560;
            }
          }
        });
      });
      index++;

      if (index >= videosList.length) {
        $scope.cache.videos = videosList;
        $scope.videoParent = videosList;
        getCurrentVideo();
      } else {
        getVideos(index);
      }
    });
    promise.error(function(data) {
      console.log("API ERROR!", arguments);
    });
  }

  var videoParentExists = false;
  if ($scope.cache.videos.length > 0) {
    for (var i = 0, k = $scope.cache.videos, l = k.length; i < l; ++i) {
      if (k[i].id === video_id) {
        console.log('CACHED!');
        getCurrentVideo(k[i]);
        break;
      }
    }
  }
  if ($scope.cache.videos.length === 0 || !videoParentExists) {
    var promise = kpapi.getVideoPlaylist();
    promise.success(function(data) {
      videosList = _.map(data.data, function(video) {
        return _.extend(video, {
          datetime: new Date(video.publishedAt),
          scale: new Transitionable([.001, .001, .001]),
          opacity: new Transitionable(0),
          properties: {
            backgroundImage: 'url('+video.thumbnails.high.url+')'
          },
          video: []
        });
      });
      getVideos(0);
    });
    promise.error(function(data) {
      console.log("API ERROR!", arguments);
      $state.go('root.home', { location: 'replace' });
    });
  }
}]);