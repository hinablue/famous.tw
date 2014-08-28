'use strict';

kp.controller('LayoutCtrl', ['$scope', '$famous', '$window', '$timeout', '$http', '$state', '$sce', 'kpapi', function ($scope, $famous, $window, $timeout, $http, $state, $sce, kpapi) {
  var EventHandler = $famous['famous/core/EventHandler'];
  var Modifier = $famous['famous/core/Modifier'];
  var Surface = $famous['famous/core/Surface'];
  var Transform = $famous['famous/core/Transform'];
  var View = $famous['famous/core/View'];

  var ContainerSurface = $famous['famous/surfaces/ContainerSurface'];
  var Transitionable = $famous['famous/transitions/Transitionable'];
  var Easing = $famous['famous/transitions/Easing'];

  var menuWidth = 300;
  var triggerMenuState = false;

  $scope.scrollHandler = new EventHandler();

  $scope.headerHeight = 75;
  $scope.footerHeight = $window.innerWidth < 600 ? 0 : 50;
  $scope.hiddenMenuButton = $window.innerWidth < 600 ? false : true;
  $scope.layoutOpacity = 1;
  $scope.layoutTransitionable = new Transitionable([0, 0, 0]);
  $scope.menuTransitionable = new Transitionable([$window.innerWidth, 0, 0]);
  $scope.cache = {
    news: {},
    gallery: [],
    videos: []
  }

  $scope.layoutView = 'home';

  $scope.headerOptions = {
    size: [undefined, $scope.headerHeight],
    classes: ['header'],
    properties: {
      backgroundColor: 'rgb(34, 195, 170)',
    },
  };
  $scope.footerOptions = {
    size: [undefined, $scope.footerHeight],
    classes: ['footer'],
    properties: {
      backgroundColor: 'rgb(34, 195, 170)',
      display: $scope.hiddenMenuButton === true ? 'block' : 'none'
    },
  };
  $scope.mainOptions = {
    size: [undefined, undefined]
  };

  $scope.menuItems = [
    {
      url: 'root.home',
      content: '首頁',
    },
    {
      url: 'root.news',
      content: '最新訊息',
    },
    {
      url: 'root.gallery',
      content: '相片花絮',
    },
    {
      url: 'root.videos',
      content: '影片一覽',
    },
    {
      url: 'root.kptaipei',
      content: '柯文哲官網',
    },
    {
      url: 'root.famous_angular',
      content: 'Famous Angular',
    },
  ];

  $scope.menuBtnOptions = {
    size: [28, 28],
    origin: [1, .5],
    transform: Transform.translate(-14, 0, 0),
  }

  $scope.menuOptions = {
    scrollView: {
      size: [undefined, undefined],
      direction: 1,
    },
    container: {
      size: [menuWidth, undefined],
      origin: [0, 0],
      properties: {
        backgroundColor: 'rgb(40, 80, 102)'
      }
    },
    opacity: 1
  };

  function switchMenu(callback) {
    var menuTransX = triggerMenuState === false ? 0 : Math.abs($scope.headerHeight - $window.innerWidth) > menuWidth ? menuWidth * -1 : $scope.headerHeight - $window.innerWidth;
    $scope.menuTransitionable.set([(menuTransX + $window.innerWidth), 0, 0], {duration: 400, curve: Easing.inOutBack});
    $scope.layoutTransitionable.set([menuTransX, 0, 0], {duration: 400, curve: Easing.inOutBack}, function() {
      $scope.layoutOpacity = triggerMenuState === false ? 1 : 0.4;
      if (callback !== undefined) {
        callback.call($scope);
      }
    });
  }
  function orientationChange() {
    $timeout(function() {
      $scope.$apply(function() {
        var menuTransX = triggerMenuState === false ? 0 : Math.abs($scope.headerHeight - $window.innerWidth) > menuWidth ? menuWidth * -1 : $scope.headerHeight - $window.innerWidth;
        $scope.menuTransitionable.set([(menuTransX + $window.innerWidth), 0, 0]);
        $scope.layoutTransitionable.set([menuTransX, 0, 0]);

        $scope.hiddenMenuButton = $window.innerWidth < 600 ? false : true;
        $scope.footerHeight = $window.innerWidth < 600 ? 0 : 50;
      });
    }, 10);
  }
  $scope.triggerHeaderMenu = function(url) {
    $state.go(url, {}, { notify: true });
  };
  $scope.triggerMenu = function(event, url) {
    triggerMenuState = !triggerMenuState;

    if (url !== undefined) {
      if (/^#http.*/.test(url)) {
        switchMenu();
        window.open(url.replace('#', ''), '_blank');
      } else {
        switchMenu(function() {
          $state.go(url, {}, { notify: true });
        });
      }
    } else {
      switchMenu();
    }
  };

  angular.element($window).bind('orientationchange', orientationChange);
  angular.element($window).bind('resize', orientationChange);
}]);