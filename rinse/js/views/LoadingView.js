define(function(require, exports, module) {
  var Engine               = require('famous/core/Engine');
  var Surface              = require('famous/core/Surface');
  var Modifier             = require('famous/core/Modifier');
  var Transform            = require('famous/core/Transform');

  var View                 = require('famous/core/View');
  var AppView              = require('views/AppView');

  function LoadingView() {
    View.apply(this, arguments);

    var surf = new Surface({
      classes: ['loading'],
      properties: {
        borderRadius: '10px',
        backgroundColor: 'rgba(33, 33, 33, 0.8)',
        textAlign: 'center',
        lineHeight: '24px',
        color: 'white'
      }
    });
    var mod = new Modifier({
      origin: [0.5, 0.5],
      size: [0, 50]
    });

    this._add(mod).add(surf);

    var slider, story, xhr, counter = 1, total = this.options.total * 2;
    for(var i = 0; i < this.options.total; i++) {
      slider = 'http://placekitten.com/'+window.innerWidth+'/'+this.options.sliderHeight+'?image='+(this.options.total - i);
      story = 'http://placekitten.com/'+this.options.storyWidth+'/'+this.options.storyHeight+'?image='+(this.options.total - i);

      (function(img) {
        var req = new XMLHttpRequest();
        // req.onprogress = function(event) {
        //   if (event.lengthComputable) {
        //     surf.setContent((event.loaded / event.total) * 100 + '%');
        //   }
        // };
        req.onreadystatechange = function() {
          if (req.readyState == 4) {
            if (req.status == 200) {
              counter++;
              surf.setContent(Math.ceil((counter / total) * 100) + '%');
              mod.setSize([Math.ceil((counter / total) * 100)*2, 24]);
              if (counter === total) {
                var appView = new AppView();
                var mainCtx = Engine.createContext();
                mainCtx.add(appView);
              }
            }
          }
        };
        req.open('GET', img, true);
        req.send();
      })(slider);

      (function(img) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
          if (req.readyState == 4) {
            if (req.status == 200) {
              counter++;
              surf.setContent(Math.ceil((counter / total) * 100) + '%');
              mod.setSize([Math.ceil((counter / total) * 100)*2, 24]);
              if (counter === total) {
                var appView = new AppView();
                var mainCtx = Engine.createContext();
                mainCtx.add(appView);
              }
            }
          }
        };
        req.open('GET', img, true);
        req.send();
      })(story);
    }
  }

  LoadingView.prototype = Object.create(View.prototype);
  LoadingView.prototype.constructor = LoadingView;

  LoadingView.DEFAULT_OPTIONS = {
    total: 10,
    sliderHeight: 500,
    storyWidth: 274,
    storyHeight: 400,
    app: undefined
  };

  module.exports = LoadingView;
});
