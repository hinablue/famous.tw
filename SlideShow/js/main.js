define(function(require, exports, module) {
  var Engine = require('famous/core/Engine');
  var Slidershow = require('Slidershow');

  var mainCtx = Engine.createContext(document.getElementById('slideshow'));
  var slidershow = new Slidershow({
    width: 1000,
    height: 500,
    sliders: [
        {
            background: 'http://placekitten.com/1000/500?image=1'
        },
        {
            background: 'http://placekitten.com/1000/500?image=2'
        },
        {
            background: 'http://placekitten.com/1000/500?image=3'
        },
        {
            background: 'http://placekitten.com/1000/500?image=4'
        },
        {
            background: 'http://placekitten.com/1000/500?image=5'
        },
        {
            background: 'http://placekitten.com/1000/500?image=6'
        },
        {
            background: 'http://placekitten.com/1000/500?image=7'
        }
    ]
  });

  slidershow.on('pageChange', function() {
    console.log(arguments);
  });

  mainCtx.add(slidershow);
  mainCtx.setPerspective(1);
});
