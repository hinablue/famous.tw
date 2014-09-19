define(function(require, exports, module) {
    'use strict';
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var EventHandler = require('famous/core/EventHandler');
    var MouseSync = require('famous/inputs/MouseSync');
    var ScrollSync = require('famous/inputs/ScrollSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var RenderNode = require('famous/core/RenderNode');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var GenericSync = require('famous/inputs/GenericSync');
    var __ = require('underscore');

    function Cube(options) {
        this.options = Object.create(Cube.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        GenericSync.register({
            'mouse': MouseSync,
            'touch': TouchSync,
            'scroll': ScrollSync
        });

        this.sync = new GenericSync(['mouse', 'scroll', 'touch'], { direction: [GenericSync.DIRECTION_X, GenericSync.DIRECTION_Y] });
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        this._eventInput.pipe(this.sync);
        this.sync.pipe(this._eventInput);

        var maxSize = Math.max(this.options.dimensions[0], this.options.dimensions[1], this.options.dimensions[2]);
        this.root = new ContainerSurface({
            classes: ['cube-container'],
            size: [maxSize, maxSize],
            properties: {
                backfaceVisibility: 'visible'
            }
        });

        var PI_OVER_2 = Math.PI / 2;
        var PI = Math.PI;
        var _faceSpecs = [
            /*front */ {origin: [0,0], translate: [0,0,0], rotate: [0,0,0], size: [this.options.dimensions[0], this.options.dimensions[1]]},
            /*top   */ {origin: [0,0], translate: [0,0,-this.options.dimensions[2]], rotate: [PI_OVER_2, 0, 0], size: [this.options.dimensions[0], this.options.dimensions[2]]},
            /*right */ {origin: [0,0], translate: [this.options.dimensions[0],0,0], rotate: [0, PI_OVER_2, 0], size: [this.options.dimensions[2], this.options.dimensions[1]]},
            /*bottom*/ {origin: [0,0], translate: [0,this.options.dimensions[1],0], rotate: [-PI_OVER_2, 0, 0], size: [this.options.dimensions[0], this.options.dimensions[2]]},
            /*left  */ {origin: [0,0], translate: [0,0,-this.options.dimensions[2]], rotate: [0, -PI_OVER_2, 0], size: [this.options.dimensions[2], this.options.dimensions[1]]},
            /*back  */ {origin: [0,0], translate: [this.options.dimensions[0],0,-this.options.dimensions[2]], rotate: [0, PI, 0], size: [this.options.dimensions[0], this.options.dimensions[1]]}
        ];

        var _faces = [new RenderNode(), new RenderNode(), new RenderNode(), new RenderNode(), new RenderNode(), new RenderNode()];
        __.each(_faces, function(face, i) {
            var spec = _faceSpecs[i];
            var _surf;

            if (this.options.surfaces === undefined || this.options.surfaces[i] === undefined) {
                _surf = new Surface({
                    classes: ['face'],
                    properties: {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                    }
                });
            } else {
                _surf = this.options.surfaces[i];
            }
            var _mod = new Modifier({
                size: spec.size,
                origin: spec.origin,
                align: [0, 0],
                transform: function() {
                    var trans = Transform.multiply(Transform.translate.apply(this, spec.translate), Transform.rotate.apply(this, spec.rotate));
                    return trans;
                }
            });
            var _face = new RenderNode().add(_mod);
            _face.add(_surf);
            _faces[i].set(_face);

            this.root.add(_faces[i]);
        }.bind(this));

        this._eventInput.bindThis(this);
    }

    Cube.prototype = Object.create(View.prototype);
    Cube.prototype.constructor = Cube;

    Cube.DEFAULT_OPTIONS = {
        dimensions: [100, 100, 100],
        surfaces: [],
        transition: {
          duration: 600,
          curve: 'easeInOut'
        }
    };

    Cube.prototype.setOptions = function setOptions(options) {
        if (options.dimensions === undefined || options.dimensions.length < 3) {
            this.options.dimensions = [100, 100, 100];
        } else {
            this.options.dimensions = options.dimensions;
        }
        if (options.transition === undefined || typeof options.transition !== 'object') {
            this.options.transition = {
                duration: 600,
                curve: 'easeInOut'
            };
        } else {
            this.options.transition = options.transition;
        }
        if (options.surfaces === undefined) {
            this.options.surfaces = [];
        } else {
            this.options.surfaces = options.surfaces;
        }
    };

    Cube.prototype.render = function render() {
        return [
            {
                target: this.root.render()
            }
        ];
    };

    module.exports = Cube;
});
