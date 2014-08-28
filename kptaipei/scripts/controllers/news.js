'use strict';

kp.controller('NewsCtrl', ['$scope', '$famous', '$window', '$timeout', '$http', '$sce', 'kpapi', '$state', '$stateParams', function($scope, $famous, $window, $timeout, $http, $sce, kpapi, $state, $stateParams) {
  var GenericSync = $famous['famous/inputs/GenericSync'],
      EventHandler = $famous['famous/core/EventHandler'],
      ElementAllocator = $famous['famous/core/ElementAllocator'],
      View = $famous['famous/core/View'];

  var Transitionable = $famous['famous/transitions/Transitionable'],
      Easing = $famous['famous/transitions/Easing'];

  console.log('news');

  var bottomMergeFix = $scope.headerHeight + $scope.footerHeight + 30;

  $scope.scrollView = {
    entries: {
      direction: 0,
    },
    article: {
      direction: 1,
    }
  };

  $scope.showArticleKey = $stateParams['key'] !== undefined && $stateParams['key'] !== '' ? (parseInt($stateParams['key'], 10) - 1) : 0;
  $scope.entries = [];

  $scope.getSize = function() {
    return [$window.innerWidth, $window.innerHeight];
  };
  $scope.articleEnter = function(article, $done) {
    article.scale.set([1, 1, 1], {duration: 1250, curve: Easing.outElastic});
    article.opacity.set(1, {duration: 1000, curve: "linear"}, $done);
  };
  $scope.articleLeave = function(article, $done) {
    article.scale.set([.01, .01, .01]);
    article.opacity.set(0, $done);
  };
  $scope.showButton = function(button) {
    if (button === 'prev' && $scope.showArticleKey > 0) {
      return true;
    }
    if (button === 'next' && $scope.showArticleKey < ($scope.entries.length - 1)) {
      return true;
    }
    return false;
  }
  $scope.moveTo = function(dir) {
    var _article = $scope.showArticleKey;
    if (dir === 'prev' && $scope.showArticleKey > 0) {
      $scope.showArticleKey--;
    } else if (dir === 'next' && $scope.showArticleKey < ($scope.entries.length - 1)) {
      $scope.showArticleKey++;
    }
    $state.transitionTo('root.news.single', { key: ($scope.showArticleKey + 1) }, { location: 'replace', notify: false, reload: false });
  };

  var mappingEntries = function(articles) {
    _.map(articles, function(category) {
      _.map(category.lists, function(article) {
        delete(article.category_id);
        delete(article.category_name);
        $scope.entries.push(_.extend(article, {
          key: $scope.entries.length,
          category: {
            id: category.id,
            name: category.name
          }
        }));
      });
    });

    if ($scope.showArticleKey >= $scope.entries.length || $scope.showArticleKey < 0) {
      $state.go('root.news', { s1: '', key: '' }, { location: 'replace', notify: false });
    }
  }

  var categoryArticles = [];
  var getChildren = function(index) {
    var promise = kpapi.getCategoryArticle(categoryArticles[index].id);
    promise.success(function(data) {
      categoryArticles[index].lists = _.map(data.data, function(article) {
        article.content = article.content.replace(/ (style|align|class)="[^"]*"/gi, '');
        // Iframe scale
        var iframeWidth = ($window.innerWidth - 80) > 900 ? 900 : ($window.innerWidth - 80);
        article.content = article.content.replace(/width="([\d]*)"[^"]*height="([\d]*)"/gi, function(match, w, h) {
          return 'width="'+iframeWidth+'" height="'+(h * iframeWidth / w)+'"';
        });
        article.content = article.content.replace(/(<\/?span[^>]*>|<\/?div[^>]*>|<hr[ \/]*>|<br[ \/]*>)/gi, '');
        article.content = article.content.replace(/(<\/?h[1-6]+[^>]*>)/gi, '');
        article.content = article.content.replace(/(<p>&nbsp;<\/p>)/gi, '');
        article.content = article.content.replace(/(\r|\n)/gi, '');
        if (article.content[0] === '%') {
          article.content = decodeURIComponent(article.content);
        }
        return _.extend(article, {
          id: article.id,
          datetime: new Date(article.post_date),
          contentSnippet: function() {
            return $sce.trustAsHtml(article.content);
          },
          scale: new Transitionable([.001, .001, .001]),
          opacity: new Transitionable(0),
          done: function($done) {
            $timeout(function() {
              $scope.$apply(function() {
                var _index = 0, _views = $famous.find('.article-view');
                for (var i = 0, v = _views, l = v.length; i < l; ++i) {
                  var _mod = v[i];
                  if ((_mod.index !== undefined && _mod.index === $scope.showArticleKey)
                    || (_mod.index === undefined && $scope.showArticleKey === 0)) {
                    var modifier = _mod.modifier,
                        surface = _mod.renderNode._child.get();

                    modifier.setSize([undefined, surface.content.scrollHeight + $scope.headerHeight + $scope.footerHeight + 20]);
                    break;
                  }
                }
                $done();
              });
            }, 1);
          }
        });
      });
      categoryArticles[index].lists.sort(function(a, b) {
        return b.id - a.id;
      });
      index++;

      if (index >= categoryArticles.length) {
        mappingEntries(categoryArticles);
        $scope.cache.news = categoryArticles;
      } else {
        getChildren(index);
      }
    });
    promise.error(function(data) {
      console.log("API ERROR!", arguments);
    });
  };

  if (Object.keys($scope.cache.news).length === 0) {
    var promise = kpapi.getCategoryList();
    promise.success(function(data) {
      categoryArticles = _.map(data.data, function(category) {
        return _.extend(category, {
          id: category.id,
          name: category.name,
          lists: []
        });
      });
      getChildren(0);
    });
    promise.error(function(data) {
      console.log("API ERROR!", arguments);
    });
  } else {
    console.log("CACHED!");
    mappingEntries($scope.cache.news);
  }
}]);