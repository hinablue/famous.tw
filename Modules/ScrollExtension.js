define(function(require, exports, module) {
  var Scrollview      = require('famous/views/Scrollview');

  function ScrollExtension() {
    Scrollview.apply(this, arguments);

    this._scroller.on('edgeHit', function(data) {
      this._edgeSpringPosition = data.position;

      if (this._scroller.onEdge() === -1) {
        if (this.getPosition() - data.position > -0.01) {
          this.setPosition(Math.ceil(data.position - 0.1));
        }
      } else if (this._scroller.onEdge() === 1) {
        if (this.getPosition() - data.position < -0.01) {
          this.setPosition(Math.ceil(data.position - 1));
        }
      }
    }.bind(this));
  }

  ScrollExtension.prototype = Object.create(Scrollview.prototype);
  ScrollExtension.prototype.constructor = ScrollExtension;

  module.exports = ScrollExtension;
});
