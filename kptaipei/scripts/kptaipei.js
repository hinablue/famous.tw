'use strict';

var kp = angular.module('kptaipei',
  ['ngAnimate', 'ngCookies',
    'ngTouch', 'ngSanitize',
    'ngResource', 'ui.router',
    'angularMoment', 'famous.angular'])
  .constant('angularMomentConfig', {
    preprocess: 'utc',
    timezone: 'Asia/Taipei'
  })
  .config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.youtube.com/**']);

    $stateProvider
      .state('root', {
        abstract: true,
        controller: 'LayoutCtrl',
        views: {
          'layout': {
            templateUrl: 'views/layout.html',
          }
        }
      })
      .state('root.home', {
        url: '/',
        views: {
          '@root': {
            controller: 'HomepageCtrl',
            templateUrl: 'views/homepage.html',
          }
        }
      })
      .state('root.news', {
        url: '/news',
        views: {
          '@root': {
            controller: 'NewsCtrl',
            templateUrl: 'views/news.html',
          }
        }
      })
      .state('root.news.single', {
        url: '/news/{key:[0-9]+}',
        views: {
          '@root': {
            controller: 'NewsCtrl',
            templateUrl: 'views/news.html',
          }
        }
      })
      .state('root.gallery', {
        url: '/gallery',
        views: {
          '@root': {
            controller: 'GalleryCtrl',
            templateUrl: 'views/gallery.html',
          }
        }
      })
      .state('root.photos', {
        url: '/gallery/{album_id:[0-9]+}',
        views: {
          '@root': {
            controller: 'PhotosCtrl',
            templateUrl: 'views/photos.html',
          }
        }
      })
      .state('root.videos', {
        url: '/videos',
        views: {
          '@root': {
            controller: 'VideosCtrl',
            templateUrl: 'views/videos.html',
          }
        }
      })
      .state('root.video', {
        url: '/videos/{video_id}',
        views: {
          '@root': {
            controller: 'VideoCtrl',
            templateUrl: 'views/video.html',
          }
        }
      })
      .state('root.kptaipei', {
        url: 'http://kptaipei.tw',
      })
      .state('root.famous_angular', {
        url: 'http://famo.us/integrations/angular',
      });

    $urlRouterProvider.otherwise('/');
  })
  .run(function(amMoment) {
    amMoment.changeLanguage('zh-tw');
  });