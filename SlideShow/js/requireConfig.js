require.config({
    shim: {

    },
    paths: {
        famous: '../../lib/famous',
        requirejs: '../../lib/require',
        almond: '../../lib/almond',
        rAF: '../../lib/requestAnimationFrame',
        fBind: '../../lib/functionPrototypeBind',
        classList: '../../lib/classList'
    }
});
require(['main']);
