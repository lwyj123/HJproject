
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
        var tempString = nohead.substring(0,tempIndex);
        return tempString;
    }

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



    win.HJproject = new HJ();

}(window)
