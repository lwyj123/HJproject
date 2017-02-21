;
! function(win) {

    "use strict";

    var HJ = function() {
        this.version = '0.0.2'; //版本号
    };

    HJ.fn = HJ.prototype;

    /**
     * 巧妙的方法实现块字符串，不过要注意使用时注释符号要和function的开始和结束处于同一行
     * @param  {Function} fn   用function包裹的目标注释块
     * @return {String}        生成的块字符串
     */
    HJ.fn.heredoc = function(fn) {
        //替换开头的
        var nohead = fn.toString()
            .replace(new RegExp("function\\s*?\\(\\)\\s*?{\\s*?\/\\*"), '');
        //替换结尾的，实现好蛋疼，有没有办法直接到最后一个
        var tempIndex = nohead.lastIndexOf("*");
        //去除了头尾，但不能保证中间的注释
        var tempString = nohead.substring(0, tempIndex);
        return tempString;
    }

    //动态加载css
    HJ.fn.link = function(href, fn, cssname, moduleName) {

        //未设置路径，则不加载css
        if (!HJalert.jsPath) return;
        var head = $('head')[0];
        var link = document.createElement('link');
        if (typeof fn === 'string') cssname = fn;
        var timeout = 0;
        var id = cssname;

        link.rel = 'stylesheet';
        link.href = HJalert.cssPath + moduleName + '/' + cssname;
        link.id = id;
        //注意加载使用轮询
        if (!$('#' + id)[0]) {
            head.appendChild(link);
        }

        if (typeof fn !== 'function') return;

        //轮询css是否加载完毕
        (function poll() {
            //超时报错
            if (++timeout > 8 * 1000 / 100) {
                return window.console && console.error('HJalert-default.css: Invalid');
            };
            $("head > #" + id)[0] ? fn() : setTimeout(poll, 100);
        }());

    };
    /**
     * 遍历功能
     * @param  {[type]}   obj [description]
     * @param  {Function} fn  [description]
     * @return {[type]}       [description]
     */
    HJ.fn.each = function(obj, fn) {
        var that = this,
            key;
        if (typeof fn !== 'function') return that;
        obj = obj || [];
        if (obj.constructor === Object) {
            for (key in obj) {
                if (fn.call(obj[key], key, obj[key])) break;
            }
        } else {
            for (key = 0; key < obj.length; key++) {
                if (fn.call(obj[key], key, obj[key])) break;
            }
        }
        return that;
    };



    /**
     * 本地存储，封装localStorage
     * @param  {String} table         取对应表
     * @param  {Object or String}     settings 可选
     * @return {unknown or Object}    若settiings设置了key就返回对应值，没有返回取的表
     */
    HJ.fn.data = function(table, settings) {
        table = table || 'HJproject';

        if (!window.JSON || !window.JSON.parse) return;

        //如果settings为null，则删除表
        if (settings === null) {
            return delete localStorage[table];
        }

        settings = typeof settings === 'object' ? settings : { key: settings };

        try {
            var data = JSON.parse(localStorage[table]);
        } catch (e) {
            var data = {};
        }

        if (settings.value) data[settings.key] = settings.value;
        if (settings.remove) delete data[settings.key];
        localStorage[table] = JSON.stringify(data);

        return settings.key ? data[settings.key] : data;
    };

    win.HJproject = new HJ();

}(window)
