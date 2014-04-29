define(function(require, exports, module) {
  var Engine = require('famous/core/Engine');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var Easing = require('famous/transitions/Easing');

  var InputSurface = require('famous/surfaces/InputSurface');

  var DeviceView = require('DeviceView');

  var mainCtx = Engine.createContext();

  var deviceHash = window.location.hash.substring(1);

  if (deviceHash === 'ipad') {
    deviceHash = 'ipad';
  } else if(deviceHash === 'nexus') {
    deviceHash = 'nexus';
  } else {
    deviceHash = 'iphone';
  }

  var deviceView = new DeviceView({
    type: deviceHash,
    screenWidth: 'default'
  });

  var deviceMod = new Modifier({
    size: deviceView.getSize(),
    origin: [.5, .5],
    transform: Transform.scale(.1, .1, 1)
  });

  deviceView.setiFrame('https://www.youtube-nocookie.com/embed/Oxn06TA8VeU');

  var s = (window.innerHeight-100) / Math.max(window.innerHeight-100, deviceView.getSize()[0], deviceView.getSize()[1]);
  deviceMod.setTransform(Transform.scale(s, s, 1), {duration: 500, curve: Easing.outBack});

  var inputModifier = new Modifier({
    size: [200, 50]
  });

  var inputSurface = new InputSurface({
    type: 'button',
    value: 'Toggle Orientation',
    properties: {
      margin: '5px',
      textAlign: 'center',
      lineHeight: '50px'
    }
  });

  inputSurface.on('click', function() {
    deviceView.toggleOrientation();
  });

  mainCtx.add(deviceMod).add(deviceView);
  mainCtx.add(inputModifier).add(inputSurface);
  mainCtx.setPerspective(1);
});
