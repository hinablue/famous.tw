define(function(require, exports, module) {
  var Engine = require('famous/core/Engine');
  var LoadingView = require('views/LoadingView');

  var mainCtx = Engine.createContext();

  var loadingView = new LoadingView();
  
  mainCtx.add(loadingView);
  mainCtx.setPerspective(1);
});
