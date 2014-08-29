'use strict';

kp.factory('kpapi', function (config, $http) {
  var _endpoint = {
    server: 'http://api.kptaipei.tw/v1/',
    category: 'category/',
    video: 'videos/',
    album: 'albums/',
  };

  return {
    getVideo: function(video_id) {
      var url = _endpoint.server + _endpoint.video + video_id + '?accessToken=' + config.getAPIKey();
      return $http.get(url);
    },
    getVideoPlaylist: function() {
      var url = _endpoint.server + _endpoint.video + '?accessToken=' + config.getAPIKey();
      return $http.get(url);
    },
    getAlbums: function() {
      var url = _endpoint.server + _endpoint.album + '?accessToken=' + config.getAPIKey();
      return $http.get(url);
    },
    getPhotos: function(album_id) {
      var url = _endpoint.server + _endpoint.album + album_id + '?accessToken=' + config.getAPIKey();
      return $http.get(url);
    },
    getCategoryList: function() {
      var url = _endpoint.server + _endpoint.category + '?accessToken=' + config.getAPIKey();
      return $http.get(url);
    },
    getCategoryArticle: function( category_id ) {
      var url = _endpoint.server + _endpoint.category + category_id + '?accessToken=' + config.getAPIKey();
      return $http.get(url);
    },
    getAllArticles: function() {
      var url = _endpoint.server + _endpoint.category + '?accessToken=' + config.getAPIKey();
      var self = this;
      var promise = this.getCategoryList();
      promise.success(function(data) {
        var categories = _.map(data.data, function(category) {
          return _.extend(category, {
            id: category.id,
            name: category.name,
            lists: []
          });
        });
        for (var i = 0, l = categories.length; i < l; ++i) {
          var promise2 = self.getCategoryArticle(categories[i].id, true);
          promise2.success(function(data) {
            categories[i].lists = data.data;

            if (i === l - 1) {
              return categories;
            }
          });
          promise2.error(function(data) {
            console.log("API ERROR!", arguments);
          });
        }
      });
      promise.error(function(data) {
        console.log("API ERROR!", arguments);
        return [];
      });
    },
  };
});
