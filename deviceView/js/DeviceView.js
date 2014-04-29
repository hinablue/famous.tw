define(function(require, exports, module) {
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var ContainerSurface = require('famous/surfaces/ContainerSurface');
  var Easing = require('famous/transitions/Easing');
  var View = require('famous/core/View');

  /**
   * Source code implementation from Famo.us offical website.
   */

  function DeviceView(options) {
    this.options = Object.create(DeviceView.DEFAULT_OPTIONS);
    this.options = options;

    View.apply(this, arguments);

    this.rotateMod = new Modifier({
      origin: [0.5, 0.5]
    });
    this.node = this._add(this.rotateMod);

    _settings.call(this);
    _container.call(this);
    _content.call(this);
    _device.call(this);

    this.portrait = false;
  }

  function _content() {
    this.container.getSize();
    this.contentMod = new Modifier({
        origin: [.5, .5]
    });
    this.reset = new Modifier({
        origin: [0, 0]
    });
    this.contentNode = this.container.add(this.contentMod).add(this.reset);
  }

  function _container() {
    this.container = new ContainerSurface({
      size: [this.options.screenWidth + 2 * this.options[this.options.type].borderWidth, this.options.screenHeight + 2 * this.options[this.options.type].borderWidth],
      properties: {
        border: this.options[this.options.type].borderWidth + "px solid black",
        borderRadius: this.options[this.options.type].borderRadius + "px",
        backgroundColor: "white",
        overflow: "hidden"
      }
    });

    this.containerMod = new Modifier({
      transform: Transform.translate(this.options.originX, this.options.originY, .01)
    });

    this.node.add(this.containerMod).add(this.container);
  }

  function _device() {
    this.device = new Surface({
      size: [this.options.width, this.options.height],
      content: '<img src="' + this.options[this.options.type].image + '" width="' + this.options.width + '">'
    });

    this.device.pipe(this._eventOutput);
    this.node.add(this.device);
  }

  function _settings() {
    if (this.options.width > 0) {
      this.options.height = this.options[this.options.type].deviceRatio * this.options.width;
    } else if(this.options.height > 0) {
      this.options.width = this.options.height / this.options[this.options.type].deviceRatio;
    } else if(this.options.screenWidth && ('default' === this.options.screenWidth)) {
      this.options.screenWidth = this.options[this.options.type].defaultScreenWidth;
      this.options.width = this.options.screenWidth / this.options[this.options.type].screenWidth;
      this.options.height = this.options[this.options.type].deviceRatio * this.options.width;
    }

    this.options.screenWidth = this.options[this.options.type].screenWidth * this.options.width;
    this.options.screenHeight = this.options[this.options.type].screenHeight * this.options.height;

    this.options.originX = this.options[this.options.type].originX * this.options.width;
    this.options.originY = this.options[this.options.type].originY * this.options.height;
  }

  DeviceView.prototype = Object.create(View.prototype);
  DeviceView.prototype.constructor = DeviceView;

  DeviceView.DEFAULT_OPTIONS = {
    type: "",
    width: 0,
    height: 0,
    iphone: {
      image: "./img/device-iphone.svg",
      deviceRatio: 659 / 317,
      screenWidth: .86,
      screenHeight: .705,
      originX: .0,
      originY: .0,
      defaultScreenWidth: 320,
      borderWidth: 4,
      borderRadius: 2
    },
    ipad: {
      image: "./img/device-ipad.svg",
      deviceRatio: 434 / 290,
      screenWidth: .89,
      screenHeight: .78,
      originX: .0,
      originY: .0,
      defaultScreenWidth: 768,
      borderWidth: 4,
      borderRadius: 2
    },
    nexus: {
      image: "./img/device-nexus.svg",
      deviceRatio: 667 / 332,
      screenWidth: .885,
      screenHeight: .728,
      originX: -.003,
      originY: -.041,
      defaultScreenWidth: 360,
      borderWidth: 0,
      borderRadius: 0
    },
    rotateTransition : {
      duration: 400,
      curve: Easing.inOutBack
    },
    transition: {
      duration: 300,
      curve: "easeInOut"
    }
  };

  DeviceView.prototype.setiFrame = function setiFrame(appUrl) {
    if (this.iFrame === undefined) {
      this.iFrameEl = document.createElement("IFRAME");
      this.iFrameEl.style.width = this.getScreenSize()[0] + "px";
      this.iFrameEl.style.height = this.getScreenSize()[1] + "px";
      this.iFrameEl.style.border = "none";
      this.iFrame = new Surface({
          content: this.iFrameEl
      });

      this.contentNode.add(this.iFrame);
      this.iFrameEl.setAttribute("src", appUrl);
    }
  };

  DeviceView.prototype.setLandscape = function setLandscape() {
    this.rotateMod.setTransform(Transform.rotateZ(Math.PI / 2), this.options.transition, function() {
      this.contentMod.setTransform(Transform.rotateZ( -1 * Math.PI / 2), this.options.rotateTransition);

      this.contentMod.setSize(
        [this.container.getSize()[1], this.container.getSize()[0]]
      );
      // Reset the iFrame size
      this.iFrameEl.style.width = this.container.getSize()[1] + "px";
      this.iFrameEl.style.height = this.container.getSize()[0] + "px";
    }.bind(this));
  };

  DeviceView.prototype.setPortrait = function setPortrait() {
    this.rotateMod.setTransform(Transform.rotateZ(0), this.options.transition, function() {
      this.contentMod.setTransform(Transform.rotateZ(0), this.options.rotateTransition);
      this.contentMod.setSize(this.container.getSize());
      // Reset the iFrame size
      this.iFrameEl.style.width = this.container.getSize()[0] + "px";
      this.iFrameEl.style.height = this.container.getSize()[1] + "px";
    }.bind(this));
  };
  DeviceView.prototype.toggleOrientation = function toggleOrientation() {
      if (false === this.portrait) {
        this.setLandscape();
      } else {
        this.setPortrait();
      }
      this.portrait = !this.portrait;
  };
  DeviceView.prototype.getSize = function getSize() {
      return [this.options.width, this.options.height];
  };
  DeviceView.prototype.getScreenSize = function getScreenSize() {
      return [this.options.screenWidth, this.options.screenHeight];
  };
  DeviceView.prototype.add = function add(node) {
      return this.contentNode.add(node);
  };
  DeviceView.prototype.getDevice = function getDevice() {
      return this.options.type;
  };

  module.exports = DeviceView;
});
