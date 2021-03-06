/**
 * @Amod
 */

(function(window) {
    if (window.define || window.require) {
        return;
    }
    var factoryMap = {};
    var modulesMap = {};
    var loadingMap = {};
    var head = document.getElementsByTagName('head')[0];

    function loadScript(id, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = id;
        head.appendChild(script);
        script.onload = callback;
    }

    define = function(id, factory) {
        // 执行factory的时候最好在形参显式带上require,否则在使用webpack等
        // 自动化工具的时候会覆盖这里定义的require，导致不必要错误
        factoryMap[id] = factory;
    };

    require = function(id) {
        var mod = modulesMap[id];
        if (mod) {
            return mod['exports'];
        }
        var factory = factoryMap[id];
        if (!factory) {
            throw new Error('can\' find module:' + id);
        }
        mod = modulesMap[id] = {
            exports: {}
        };
        var ret = (typeof factory === 'function') ?
            factory.apply(mod, [require, mod['exports'], mod]) :
            factory;
        if (ret) {
            mod['exports'] = ret
        }
        return mod['exports'];
    };

    require.async = function(names, callback) {
        if (typeof names === 'string') {
            names = [names]
        }

        var num = names.length;

        function loadOne() {
            num--;
            if (num === 0) {
                callback()
            }
        }

        function load() {
            for (var i = names.length - 1; i >= 0; i--) {
                loadScript(names[i], loadOne);
            }
        }
        load()
    }

    define.amd = {
        version: 'v0.0.1'
    };
    window.define = define;
    window.require = require;
})(window);