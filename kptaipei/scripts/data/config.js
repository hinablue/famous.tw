'use strict';

kp.factory('config', function () {
  var API_KEY = "kp53f56286cdf1a6.08398476";

  return {
    getAPIKey: function(){
      return API_KEY;
    }
  };
});