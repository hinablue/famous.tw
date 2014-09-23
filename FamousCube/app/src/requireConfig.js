/*globals require*/
require.config({
    shim: {

    },
    paths: {
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        underscore: '../lib/underscore/underscore'
    },
    packages: [

    ]
});
require(['main']);
