/*globals define*/
define(function(require, exports, module) {
    'use strict';
    var View = require('famous/core/View');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var GenericSync = require('famous/inputs/GenericSync');
    var MouseSync = require('famous/inputs/MouseSync');
    var ScrollSync = require('famous/inputs/ScrollSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var EventHandler = require('famous/core/EventHandler');
    var Easing = require('famous/transitions/Easing');
    var Timer = require('famous/utilities/Timer');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');
    var Cube = require('views/Cube');
    var __ = require('underscore');

    function FamousCube() {
        View.apply(this, arguments);

        var initialTime = Date.now();
        var _root = new View();
        var _child;
        var i;
        var mod;
        var cube;
        var trans;
        var dimensions = [50, 50, 50];
        /**
         * F
         */
        var famousMod = [];
        for (i = 0; i < 10; i++) {
            trans = new TransitionableTransform();
            mod = new Modifier({
                transform: trans
            });
            cube = new Cube({ dimensions: dimensions });
            _child = new View();
            _child.add(mod).add(cube);
            _root.add(_child);

            if (i < 5) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(50, 50 * i + 50, 0)
                });
            } else if (i >= 5 && i < 8) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(100 + (i - 5) * 50, 50, 0)
                });
            } else {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(100 + (i - 8) * 50, 150, 0)
                });
            }
        }

        /**
         * A
         */
        for (i = 0; i < 11; i++) {
            trans = new TransitionableTransform();
            mod = new Modifier({
                transform: trans
            });
            cube = new Cube({ dimensions: dimensions });
            _child = new View();
            _child.add(mod).add(cube);
            _root.add(_child);

            if (i < 4) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(300 - i * 25, 50 * i + 50, 0)
                });
            } else if (i >= 4 && i < 7) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(325 + (i - 4) * 25, 50 * (i - 4) + 100, 0)
                });
            } else if (i >= 7 && i < 9) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(275 + (i - 7) * 50, 200, 0)
                });
            } else {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(225 + (i - 9) * 150, 250, 0)
                });
            }
        }

        /**
         * M
         */
        for (i = 0; i < 17; i++) {
            trans = new TransitionableTransform();
            mod = new Modifier({
                transform: trans
            });
            cube = new Cube({ dimensions: dimensions });
            _child = new View();
            _child.add(mod).add(cube);
            _root.add(_child);

            if (i < 5) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(450, 50 * i + 50, 0)
                });
            } else if (i >= 5 && i < 10) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(700, 50 * (i - 5) + 50, 0)
                });
            } else if (i >= 10 && i < 14) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(500 + (i - 10) * 25, 50 * (i - 10) + 75, 0)
                });
            } else {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(650 - (i - 14) * 25, 50 * (i - 14) + 75, 0)
                });
            }
        }
        /**
         * O
         */
        for (i = 0; i < 12; i++) {
            trans = new TransitionableTransform();
            mod = new Modifier({
                transform: trans
            });
            cube = new Cube({ dimensions: dimensions });
            _child = new View();
            _child.add(mod).add(cube);
            _root.add(_child);

            if (i < 2) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(825 + i * 50, 50, 0)
                });
            } else if (i >= 2 && i < 4) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(825 + (i - 2) * 50, 250, 0)
                });
            } else if (i >= 4 && i < 8) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(775, 75 + (i - 4) * 50, 0)
                });
            } else {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(925, 75 + (i - 8) * 50, 0)
                });
            }
        }
        /**
         * DOT
         */
        trans = new TransitionableTransform();
        mod = new Modifier({
            transform: trans
        });
        cube = new Cube({ dimensions: dimensions });
        _child = new View();
        _child.add(mod).add(cube);
        _root.add(_child);

        famousMod.push({
            cube: cube,
            mod: mod,
            trans: trans,
            singleAnimate: true,
            final: Transform.translate(1000, 250, 0)
        });

        /**
         * U
         */
        for (i = 0; i < 11; i++) {
            trans = new TransitionableTransform();
            mod = new Modifier({
                transform: trans
            });
            cube = new Cube({ dimensions: dimensions });
            _child = new View();
            _child.add(mod).add(cube);
            _root.add(_child);

            if (i < 4) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(1075, 50 + i * 50, 0)
                });
            } else if (i >= 4 && i < 8) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(1225, 50 + (i - 4) * 50, 0)
                });
            } else {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(1100 + (i - 8) * 50, 250, 0)
                });
            }
        }
        /**
         * S
         */
        for (i = 0; i < 10; i++) {
            trans = new TransitionableTransform();
            mod = new Modifier({
                transform: trans
            });
            cube = new Cube({ dimensions: dimensions });
            _child = new View();
            _child.add(mod).add(cube);
            _root.add(_child);

            if (i < 2) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(1350 + i * 50, 50, 0)
                });
            } else if (i >= 2 && i < 4) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(1350 + (i - 2) * 50, 250, 0)
                });
            } else if (i >= 4 && i < 6) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(1350 + (i - 4) * 50, 150, 0)
                });
            } else if (i >= 6 && i < 8) {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(1300, 75 + (i - 6) * 50, 0)
                });
            } else {
                famousMod.push({
                    cube: cube,
                    mod: mod,
                    trans: trans,
                    singleAnimate: true,
                    final: Transform.translate(1450, 175 + (i - 8) * 50, 0)
                });
            }
        }
        trans = new TransitionableTransform();
        mod = new Modifier({
            transform: trans
        });
        cube = new Cube({ dimensions: dimensions });
        _child = new View();
        _child.add(mod).add(cube);
        _root.add(_child);

        famousMod.push({
            cube: cube,
            mod: mod,
            trans: trans,
            singleAnimate: true,
            final: Transform.translate(1300, 225, 0)
        });

        trans = new TransitionableTransform();
        mod = new Modifier({
            transform: trans
        });
        cube = new Cube({ dimensions: dimensions });
        _child = new View();
        _child.add(mod).add(cube);
        _root.add(_child);

        famousMod.push({
            cube: cube,
            mod: mod,
            trans: trans,
            singleAnimate: true,
            final: Transform.translate(1450, 75, 0)
        });

        famousMod.sort(function(a, b) {
            return Math.round(Math.random()) - 0.5;
        });

        var singleAnimate = function(target, sfinal, duration, direction) {
            sfinal = sfinal === undefined ? Transform.translate(1500 * Math.random(), 1500 * Math.random(), 500 * Math.random()) : sfinal;
            duration = duration === undefined ? 1000 : duration;
            direction = direction === undefined ? true : direction;
            target.trans.set(sfinal, {
                duration: duration,
                curve: Easing.inOutExpo
            }, function() {
                var sfinal = target.trans.getFinal();
                var scale = .25 * Math.random();
                var rotate = Math.random();
                var key = Math.ceil(Math.random() * 3);
                if (direction) {
                    sfinal[(11 + key)] -= 100 * Math.random();
                    sfinal[0] -= scale;
                    sfinal[5] -= scale;
                    sfinal[10] -= scale;
                    sfinal = Transform.multiply(sfinal, Transform.rotate(rotate * -1, rotate * -1, rotate * -1));
                } else {
                    sfinal[(11 + key)] += 100 * Math.random();
                    sfinal[0] += scale;
                    sfinal[5] += scale;
                    sfinal[10] += scale;
                    sfinal = Transform.multiply(sfinal, Transform.rotate(rotate, rotate, rotate));
                }
                direction = !direction;

                if (target.singleAnimate === true) {
                    singleAnimate(target, sfinal, Math.random() * 1000 + 3500, direction);
                }
            });
        };

        __.each(famousMod, function(mod, i) {
            famousMod[i].cube.root.on('click', function() {
                var nodes = this.context._node._child;
                __.each(nodes, function(node) {
                    node = node.get();
                    var mod = node.get();
                    var surf = node._child.get();
                    surf.setProperties({
                        backgroundColor: 'rgba(255, 100, 100, .5)'
                    });
                });
            });
            singleAnimate(mod);
        });

        var finalTrans = new TransitionableTransform();
        var key = 0;
        var animate = function(key) {
            if (key >= famousMod.length) {
                Timer.setTimeout(function() {
                    __.each(famousMod, function(mod, i) {
                        famousMod[i].singleAnimate = true;
                        singleAnimate(famousMod[i]);
                    });
                    Timer.setTimeout(function() {
                        animate(0);
                    }, 2500);
                }, 3000);
                return false;
            }
            var mod = famousMod[key];
            famousMod[key].singleAnimate = false;
            famousMod[key].trans.halt();
            var final = Transform.multiply(mod.final, Transform.rotate(Math.random() * Date.now() * .002, Math.random() * Date.now() * -.001, Math.random() * Date.now() * -.002));
            mod.trans.set(final, {
                duration: Math.round(Math.random() * 300) + 300,
                curve: Easing.inOutExpo
            }, function() {
                mod.trans.set(mod.final, {
                    duration: 333,
                    curve: Easing.inOutCirc
                }, function() {
                });

                key++;
                animate(key);
            });
        };

        Timer.setTimeout(function() {
            animate(0);
        }, 2000);

        var surf = new ContainerSurface({
            properties: {
                backfaceVisibility: 'visible',
                '-webkit-backface-visibility': 'visible'
            }
        });
        var surfcube = new ContainerSurface({
            properties: {
                backfaceVisibility: 'visible',
                '-webkit-backface-visibility': 'visible'
            }
        });

        var modFinal = Transform.multiply(Transform.translate(0, 0, 0), Transform.rotate(.5, -.005, 0));
        modFinal = Transform.multiply(modFinal, Transform.scale(.6, .6, .6));
        finalTrans.set(modFinal);

        mod = new Modifier({
            origin: [.5, .5],
            align: [.5, .5],
            transform: finalTrans
        });

        surfcube.add(_root);
        surf.add(mod).add(surfcube);

        GenericSync.register({
            'mouse': MouseSync,
            'touch': TouchSync,
            'scroll': ScrollSync
        });

        var sync = new GenericSync(['mouse', 'scroll', 'touch'], {
            direction: [GenericSync.DIRECTION_X, GenericSync.DIRECTION_Y]
        });
        surf.pipe(sync).pipe(this);
        sync.on('update', function(data) {
            var modFinal = finalTrans.getFinal();
            var rotate = [
                data.delta[1] * .001,
                data.delta[0] * -.002
            ];
            modFinal = Transform.multiply(modFinal, Transform.rotate(rotate[0], rotate[1], 0));
            finalTrans.set(modFinal);
        });

        mod = new Modifier({
            origin: [.5, .5],
            // transform: Transform.scale(.5, .5, .5)
            transform: function() {
                return Transform.rotate(0, .0001 * (Date.now() - initialTime), 0);
            }
        });

        this.add(mod).add(surf);

        return this;
    }

    FamousCube.prototype = Object.create(View.prototype);
    FamousCube.prototype.constructor = FamousCube;

    FamousCube.DEFAULT_OPTIONS = {
    };

    module.exports = FamousCube;
});
