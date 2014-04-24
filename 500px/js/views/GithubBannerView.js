define(function(require, exports, module) {
  var Surface              = require('famous/core/Surface');
  var ModifierChain        = require('famous/modifiers/ModifierChain');
  var StateModifier        = require('famous/modifiers/StateModifier');
  var Transform            = require('famous/core/Transform');
  var View                 = require('famous/core/View');

  function GithubBannerView() {
    View.apply(this, arguments);

    _createContent.call(this);
  }

  GithubBannerView.prototype = Object.create(View.prototype);
  GithubBannerView.prototype.constructor = GithubBannerView;

  GithubBannerView.DEFAULT_OPTIONS = {
  };

  function _createContent() {
    var surf = new Surface({
      size: [200, 24],
      classes: ['github-banner'],
      content: '<a href="https://github.com/hinablue/famous.tw/">Fork me on github</a>'
    });
    var modChain = new ModifierChain();
    modChain.addModifier(
      new StateModifier({
        transform: Transform.rotateZ(45 * Math.PI / 180),
        origin: [1, 0]
      }),
      new StateModifier({
        transform: Transform.translate(24, Math.sqrt(2)*100 - 24, 0)
      })
    );


    this._add(modChain).add(surf);
  }

  module.exports = GithubBannerView;
});
