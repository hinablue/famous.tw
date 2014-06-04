define(function(require, exports, module) {
  var Engine = require('famous/core/Engine');
  var Slidershow = require('Slidershow');

  var mainCtx = Engine.createContext();
  var slidershow = new Slidershow({
    height: 500,
    sliders: [
        {
            background: 'http://placekitten.com/'+window.innerWidth+'/500?image=1'
        },
        {
            background: 'http://placekitten.com/'+window.innerWidth+'/500?image=2'
        },
        {
            background: 'http://placekitten.com/'+window.innerWidth+'/500?image=3'
        },
        {
            background: 'http://placekitten.com/'+window.innerWidth+'/500?image=4'
        },
        {
            background: 'http://placekitten.com/'+window.innerWidth+'/500?image=5'
        },
        {
            background: 'http://placekitten.com/'+window.innerWidth+'/500?image=6'
        },
        {
            background: 'http://placekitten.com/'+window.innerWidth+'/500?image=7'
        }
    ]
  });

  mainCtx.add(slidershow);
  mainCtx.setPerspective(1);
});
