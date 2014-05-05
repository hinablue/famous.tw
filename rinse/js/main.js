define(function(require, exports, module) {
  var Engine = require('famous/core/Engine');
  var AppView = require('views/AppView');

  var mainCtx = Engine.createContext();
  var appView = new AppView(Engine);

  mainCtx.add(appView);
  mainCtx.setPerspective(1);
});
