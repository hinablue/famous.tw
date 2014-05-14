define(function(require, exports, module) {
  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var ModifierChain = require('famous/modifiers/ModifierChain');

  var ContainerSurface = require('famous/surfaces/ContainerSurface');
  var SequentialLayout = require('famous/views/SequentialLayout');
  var Utility = require('famous/utilities/Utility');

  var mainCtx = Engine.createContext();

  var container = new ContainerSurface({
    properties: {
      overflow: 'auto'
    }
  });
  container.context.setPerspective(800);

  var surface, modifier, modifierChain, transform, content;

  surface = new Surface({
    size: [100, 100],
    content: 'Hello World',
    properties: {
      backgroundColor: 'rgb(255, 66, 33)',
      lineHeight: '100px',
      fontSize: '14px',
      color: 'white',
      textAlign: 'center'
    }
  });

  modifier = new Modifier({
    transform: Transform.translate(0, 0, 0)
  });
  container.add(modifier).add(surface);

  surface = new Surface({
    content: 'Transform.translate(0, 0, 0) <pre>'+Transform.translate(0, 0, 0).toString()+'</pre>'
  });
  modifier = new Modifier({
    transform: Transform.translate(110, 0, 0)
  });
  container.add(modifier).add(surface);

  surface = new Surface({
    size: [100, 100],
    content: 'Hello World',
    properties: {
      backgroundColor: 'rgb(255, 66, 33)',
      lineHeight: '100px',
      fontSize: '14px',
      color: 'white',
      textAlign: 'center'
    }
  });
  var translateModifier = new Modifier({
    transform: Transform.translate(100, 110, 0)
  });
  container.add(translateModifier).add(surface);

  surface = new Surface({
    content: 'Transform.translate(100, 110, 0)<pre>'+Transform.translate(100, 110, 0).toString()+'</pre>'
  });
  modifier = new Modifier({
    transform: Transform.translate(210, 110, 0)
  });
  container.add(modifier).add(surface);

  surface = new Surface({
    size: [100, 100],
    content: 'Hello World',
    properties: {
      backgroundColor: 'rgb(255, 66, 33)',
      lineHeight: '100px',
      fontSize: '14px',
      color: 'white',
      textAlign: 'center'
    }
  });
  modifierChain = new ModifierChain();
  var scaleModifier = new Modifier({
    transform: Transform.scale(2, 2, 1)
  });
  modifierChain.addModifier(
    scaleModifier,
    new Modifier({
      transform: Transform.translate(0, 250, 0)
    })
  );
  container.add(modifierChain).add(surface);

  content = 'Transform.scale(2, 2, 1)<pre>'+Transform.scale(2, 2, 1).toString()+'</pre>';
  content += 'Note: setPerspective(1000);';

  surface = new Surface({
    content: content
  });
  modifier = new Modifier({
    transform: Transform.translate(130, 250, 0)
  });
  container.add(modifier).add(surface);

  surface = new Surface({
    size: [100, 100],
    content: 'Hello World',
    properties: {
      backgroundColor: 'rgb(255, 66, 33)',
      lineHeight: '100px',
      fontSize: '14px',
      color: 'white',
      textAlign: 'center'
    }
  });
  modifierChain = new ModifierChain();
  var rotateModifier = new Modifier({
    transform: Transform.rotateZ(Math.PI / 4)
  });
  modifierChain.addModifier(
    rotateModifier,
    new Modifier({
      transform: Transform.translate(80, 360, 0)
    })
  );
  container.add(modifierChain).add(surface);

  content = 'Transform.rotateZ(Math.PI / 4)<pre>'+Transform.rotateZ(Math.PI / 4).toString();
  content += '</pre> Note: setPerspective(1000);<br>Use ModifierChain here.';

  surface = new Surface({
    content: content
  });
  modifier = new Modifier({
    transform: Transform.translate(160, 380, 0)
  });
  container.add(modifier).add(surface);

  surface = new Surface({
    size: [100, 100],
    content: 'Hello World',
    properties: {
      backgroundColor: 'rgb(255, 66, 33)',
      lineHeight: '100px',
      fontSize: '14px',
      color: 'white',
      textAlign: 'center'
    }
  });
  modifierChain = new ModifierChain();
  var skewModifier = new Modifier({
    transform: Transform.skew(Math.PI / 6, 0, 0)
  });
  modifierChain.addModifier(
    new Modifier({
      transform: Transform.rotateY(Math.PI / 8)
    }),
    skewModifier,
    new Modifier({
      transform: Transform.translate(10, 540, 0)
    })
  );
  container.add(modifierChain).add(surface);

  content = 'Transform.skew(Math.PI / 6, 0, 0)<pre>'+Transform.skew(Math.PI / 6, 0, 0).toString();
  content += '</pre> Note: setPerspective(1000);<br>Use ModifierChain here, Transform.rotateY(Math.PI / 8) first.<br>';
  content += 'See also: <a href="http://stackoverflow.com/questions/13206220/3d-skew-transformation-matrix-along-one-coordinate-axis">3D skew transformation matrix along one coordinate axis</a>';

  surface = new Surface({
    content: content
  });
  modifier = new Modifier({
    transform: Transform.translate(160, 520, 0)
  });
  container.add(modifier).add(surface);

  surface = new Surface({
    size: [100, 100],
    content: 'Hello World',
    properties: {
      backgroundColor: 'rgb(255, 66, 33)',
      lineHeight: '100px',
      fontSize: '14px',
      color: 'white',
      textAlign: 'center'
    }
  });
  var inverseModifierChain = new ModifierChain();
  var inverseRotate = new Modifier({
    transform: Transform.inverse(Transform.rotateZ(Math.PI / 8))
  });
  inverseModifierChain.addModifier(
    new Modifier({
      transform: Transform.rotateZ(Math.PI / 4)
    }),
    inverseRotate,
    new Modifier({
      transform: Transform.translate(80, 680, 0)
    })
  );
  container.add(inverseModifierChain).add(surface);

  content = 'Transform.rotateZ(Math.PI / 8)<pre>'+Transform.rotateZ(Math.PI / 8).toString();
  content += '</pre>Transform.inverse(Transform.rotateZ(Math.PI / 8))<pre>'+Transform.inverse(Transform.rotateZ(Math.PI / 8)).toString();
  content += '</pre>Transform.transpose(Transform.rotateZ(Math.PI / 8))<pre>'+Transform.transpose(Transform.rotateZ(Math.PI / 8)).toString();
  content += '</pre> Note: setPerspective(1000);<br>Use ModifierChain here, Transform.rotateY(Math.PI / 4) first.<br>';

  surface = new Surface({
    content: content
  });
  modifier = new Modifier({
    transform: Transform.translate(160, 680, 0)
  });
  container.add(modifier).add(surface);

  setIntervalCheck = false;
  setInterval(function() {
    if (setIntervalCheck) {
      translateModifier.setTransform(Transform.translate(100, 110, 0), {
        duration: 200,
        curve: "easeInOut"
      });
      scaleModifier.setTransform(Transform.scale(2,2,1), {
        duration: 200,
        curve: "easeInOut"
      });
      rotateModifier.setTransform(Transform.rotateZ(Math.PI / 4), {
        duration: 200,
        curve: "easeInOut"
      });
      skewModifier.setTransform(Transform.skew(Math.PI / 6, 0, 0), {
        duration: 200,
        curve: "easeInOut"
      });
      inverseRotate.setTransform(Transform.rotateZ(Math.PI / 8), {
        duration: 200,
        curve: "easeInOut"
      });
      setIntervalCheck = false;
    } else {
      translateModifier.setTransform(Transform.translate(0, 110, 0), {
        duration: 200,
        curve: "easeInOut"
      });
      scaleModifier.setTransform(Transform.scale(1, 1, 1), {
        duration: 200,
        curve: "easeInOut"
      });
      rotateModifier.setTransform(Transform.rotateZ(0), {
        duration: 200,
        curve: "easeInOut"
      });
      skewModifier.setTransform(Transform.skew(0, 0, 0), {
        duration: 200,
        curve: "easeInOut"
      });
      inverseRotate.setTransform(Transform.inverse(Transform.rotateZ(Math.PI / 8)), {
        duration: 200,
        curve: "easeInOut"
      });
      setIntervalCheck = true;
    }
  }, 500);

  mainCtx.add(container);
});