/**

 @Name：Xgalert v0.0.1 Web弹出层组件
 @Author：梁王 绿豆
 @Site：None
 @License：MIT
 当前初版是基于layui(贤心)改的
 */

;
! function(window, undefined) {
    "use strict";

    var $, win, ready = {
        getPath: function() {
            var js = document.scripts,
                script = js[js.length - 1],
                jsPath = script.src;
            if (script.getAttribute('merge')) return;
            return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
        }(),

        config: {},
        end: {},
        minIndex: 0,
        btn: ['&#x786E;&#x5B9A;', '&#x53D6;&#x6D88;'],

        //五种原始层模式
        type: ['dialog', 'page', 'loading']
    };

    //默认内置方法。
    var layer = {
        v: '3.0.1',
        index: (window.layer && window.layer.v) ? 100000 : 0,
        path: ready.getPath,
        config: function(options, fn) {
            options = options || {};
            layer.cache = ready.config = $.extend({}, ready.config, options);
            layer.path = ready.config.path || layer.path;
            typeof options.extend === 'string' && (options.extend = [options.extend]);

            if (ready.config.path) layer.ready();

            if (!options.extend) return this;

            layer.link('skin/' + options.extend);

            return this;
        },

        //载入CSS配件
        link: function(href, fn, cssname) {

            //未设置路径，则不主动加载css
            if (!layer.path) return;

            var head = $('head')[0],
                link = document.createElement('link');
            if (typeof fn === 'string') cssname = fn;
            var app = (cssname || href).replace(/\.|\//g, '');
            var id = 'layuicss-' + app,
                timeout = 0;

            link.rel = 'stylesheet';
            link.href = layer.path + href;
            link.id = id;

            if (!$('#' + id)[0]) {
                head.appendChild(link);
            }

            if (typeof fn !== 'function') return;

            //轮询css是否加载完毕
            (function poll() {
                if (++timeout > 8 * 1000 / 100) {
                    return window.console && console.error('layer.css: Invalid');
                };
                parseInt($('#' + id).css('width')) === 1989 ? fn() : setTimeout(poll, 100);
            }());
        },

        ready: function(callback) {
            var cssname = 'skinlayercss',
                ver = '1110';
            layer.link('skin/default/layer.css?v=' + layer.v + ver, callback, cssname);
            return this;
        },

    };

    var Class = function(setings) {
        var that = this;
        that.index = ++layer.index;
        that.config = $.extend({}, that.config, ready.config, setings);
        document.body ? that.creat() : setTimeout(function() {
            that.creat();
        }, 50);
    };

    Class.pt = Class.prototype;

    //缓存常用字符
    var doms = ['layui-layer', '.layui-layer-title', '.layui-layer-main', '.layui-layer-dialog', 'layui-layer-iframe', 'layui-layer-content', 'layui-layer-btn', 'layui-layer-close'];
    doms.anim = ['layer-anim', 'layer-anim-01', 'layer-anim-02', 'layer-anim-03', 'layer-anim-04', 'layer-anim-05', 'layer-anim-06'];

    /**
     * 默认配置
     * @type {Object}
     */
    Class.pt.config = {
        type: 0,
        shade: 0.3,
        fixed: true,
        move: doms[1], //默认title为拖曳元素
        title: '&#x4FE1;&#x606F;',
        offset: 'auto',
        area: 'auto',
        closeBtn: 1,
        time: 0, //0表示不自动关闭
        zIndex: 19891014,
        maxWidth: 360,
        anim: 0,
        icon: -1,
        moveType: 1,
        resize: true,
        scrollbar: true, //是否允许浏览器滚动条
    };

    /**
     * 容器，用来设定弹出框的模板
     * @param  {[type]}   conType  [description]
     * @param  {Function} callback 输入3个参数，第一个是数组依次存遮罩、主体的string表达，第二个是标题栏的html，第三个是拖曳对象（暂时不理解怎么用的）
     * @return {[type]}            [description]
     */
    Class.pt.vessel = function(conType, callback) {
        var that = this,
            times = that.index,
            config = that.config;
        var zIndex = config.zIndex + times,
            titype = typeof config.title === 'object';
        var ismax = config.maxmin && (config.type === 1 || config.type === 2);
        var titleHTML = (config.title ? '<div class="layui-layer-title" style="' + (titype ? config.title[1] : '') + '">' + (titype ? config.title[0] : config.title) + '</div>' : '');

        config.zIndex = zIndex;
        callback([
            //遮罩
            config.shade ? ('<div class="layui-layer-shade" id="layui-layer-shade' + times + '" times="' + times + '" style="' + ('z-index:' + (zIndex - 1) + '; background-color:' + (config.shade[1] || '#000') + '; opacity:' + (config.shade[0] || config.shade) + '; filter:alpha(opacity=' + (config.shade[0] * 100 || config.shade * 100) + ');') + '"></div>') : '',

            //主体
            '<div class="' + doms[0] + (' layui-layer-' + ready.type[config.type]) + (((config.type == 0 || config.type == 2) && !config.shade) ? ' layui-layer-border' : '') + ' ' + (config.skin || '') + '" id="' + doms[0] + times + '" type="' + ready.type[config.type] + '" times="' + times + '" showtime="' + config.time + '" conType="' + (conType ? 'object' : 'string') + '" style="z-index: ' + zIndex + '; width:' + config.area[0] + ';height:' + config.area[1] + (config.fixed ? '' : ';position:absolute;') + '">' + (conType && config.type != 2 ? '' : titleHTML) + '<div id="' + (config.id || '') + '" class="layui-layer-content' + ((config.type == 0 && config.icon !== -1) ? ' layui-layer-padding' : '') + (config.type == 3 ? ' layui-layer-loading' + config.icon : '') + '">' + (config.type == 0 && config.icon !== -1 ? '<i class="layui-layer-ico layui-layer-ico' + config.icon + '"></i>' : '') + (config.type == 1 && conType ? '' : (config.content || '')) + '</div>' + '<span class="layui-layer-setwin">' + function() {
                var closebtn = ismax ? '<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>' : '';
                config.closeBtn && (closebtn += '<a class="layui-layer-ico ' + doms[7] + ' ' + doms[7] + (config.title ? config.closeBtn : (config.type == 4 ? '1' : '2')) + '" href="javascript:;"></a>');
                return closebtn;
            }() + '</span>' + (config.btn ? function() {
                var button = '';
                typeof config.btn === 'string' && (config.btn = [config.btn]);
                for (var i = 0, len = config.btn.length; i < len; i++) {
                    button += '<a class="' + doms[6] + '' + i + '">' + config.btn[i] + '</a>'
                }
                return '<div class="' + doms[6] + ' layui-layer-btn-' + (config.btnAlign || '') + '">' + button + '</div>'
            }() : '') + (config.resize ? '<span class="layui-layer-resize"></span>' : '') + '</div>'
        ], titleHTML, $('<div class="layui-layer-move"></div>'));
        return that;
    };

    /**
     * 创建窗口骨架
     * @return {undefined} 无
     */
    Class.pt.creat = function() {
        var that = this,
            config = that.config,
            times = that.index,
            nodeIndex, content = config.content,
            conType = typeof content === 'object',
            body = $('body');

        if (config.id && $('#' + config.id)[0]) return;

        if (typeof config.area === 'string') {
            config.area = config.area === 'auto' ? ['', ''] : [config.area, ''];
        }

        //依据情况初始化（比如关闭其他弹出层）
        switch (config.type) {
            // case 0:
            //     config.btn = ('btn' in config) ? config.btn : ready.btn[0];
            //     layer.closeAll('dialog');
            //     break;
        }

        //建立容器
        that.vessel(conType, function(html, titleHTML, moveElem) {
            body.append(html[0]);
            body.append(html[1]);
            $('.layui-layer-move')[0] || body.append(ready.moveElem = moveElem);
            /**
             * layero是弹出窗的jquery对象
             * @type {object}
             */
            that.layero = $('#' + doms[0] + times);

            //设置溢出部分隐藏(可以考虑加滚动条)
            doms.html.css('overflow', 'hidden').attr('layer-full', times);
        }).auto(times);


        //坐标自适应浏览器窗口尺寸
        that.offset();

        //如果设置的持续时间则添加计时器
        config.time <= 0 || setTimeout(function() {
            layer.close(that.index)
        }, config.time);

        //添加move和一些回调事件
        that.move().callback();

        //为兼容jQuery3.0的css动画影响元素尺寸计算？？
        if (doms.anim[config.anim]) {
            that.layero.addClass(doms.anim[config.anim]).data('anim', true);
        };
    };

    /**
     * 自适应
     * @param  {int} index     自适应对象的index
     * @return {Object}        返回实例对象本身
     */
    Class.pt.auto = function(index) {
        var that = this,
            config = that.config,
            layero = $('#' + doms[0] + index);
        if (config.area[0] === '' && config.maxWidth > 0) {
            layero.outerWidth() > config.maxWidth && layero.width(config.maxWidth);
        }
        var area = [layero.innerWidth(), layero.innerHeight()];
        var titHeight = layero.find(doms[1]).outerHeight() || 0;
        var btnHeight = layero.find('.' + doms[6]).outerHeight() || 0;

        function autoElemHeight(elem) {
            elem = layero.find(elem);
            elem.height(area[1] - titHeight - btnHeight - 2 * (parseFloat(elem.css('padding')) | 0));
        }
        switch (config.type) {

            default: if (config.area[1] === '') {
                    if (config.fixed && area[1] >= win.height()) {
                        area[1] = win.height();
                        autoElemHeight('.' + doms[5]);
                    }
                } else {
                    autoElemHeight('.' + doms[5]);
                }
            break;
        }
        return that;
    };

    /**
     * 计算坐标并设置偏移
     * @return {undefined}   无
     */
    Class.pt.offset = function() {
        var that = this,
            config = that.config,
            layero = that.layero;
        var area = [layero.outerWidth(), layero.outerHeight()];
        var type = typeof config.offset === 'object';
        that.offsetTop = (win.height() - area[1]) / 2;
        that.offsetLeft = (win.width() - area[0]) / 2;

        if (type) {
            that.offsetTop = config.offset[0];
            that.offsetLeft = config.offset[1] || that.offsetLeft;
        } else if (config.offset !== 'auto') {

            that.offsetTop = config.offset;
        }

        that.offsetTop = /%$/.test(that.offsetTop) ?
            win.height() * parseFloat(that.offsetTop) / 100 : parseFloat(that.offsetTop);
        that.offsetLeft = /%$/.test(that.offsetLeft) ?
            win.width() * parseFloat(that.offsetLeft) / 100 : parseFloat(that.offsetLeft);
        that.offsetTop += win.scrollTop();
        that.offsetLeft += win.scrollLeft();

        layero.css({ top: that.offsetTop, left: that.offsetLeft });
    };

    /**
     * move事件绑定，包括拖曳和调整大小
     * @return {Object} 返回实例对象
     */
    Class.pt.move = function() {
        var that = this,
            config = that.config,
            _DOC = $(document),
            layero = that.layero,
            moveElem = layero.find(config.move),
            resizeElem = layero.find('.layui-layer-resize'),
            dict = {};

        if (config.move) {
            moveElem.css('cursor', 'move');
        }

        moveElem.on('mousedown', function(e) {
            e.preventDefault();
            if (config.move) {
                dict.moveStart = true;
                dict.offset = [
                    e.clientX - parseFloat(layero.css('left')), e.clientY - parseFloat(layero.css('top'))
                ];
                ready.moveElem.css('cursor', 'move').show();
            }
        });

        resizeElem.on('mousedown', function(e) {
            e.preventDefault();
            dict.resizeStart = true;
            dict.offset = [e.clientX, e.clientY];
            dict.area = [
                layero.outerWidth(), layero.outerHeight()
            ];
            ready.moveElem.css('cursor', 'se-resize').show();
        });

        _DOC.on('mousemove', function(e) {

            //拖拽移动
            if (dict.moveStart) {
                var X = e.clientX - dict.offset[0],
                    Y = e.clientY - dict.offset[1],
                    fixed = layero.css('position') === 'fixed';

                e.preventDefault();

                dict.stX = fixed ? 0 : win.scrollLeft();
                dict.stY = fixed ? 0 : win.scrollTop();

                //控制元素不被拖出窗口外
                if (!config.moveOut) {
                    var setRig = win.width() - layero.outerWidth() + dict.stX,
                        setBot = win.height() - layero.outerHeight() + dict.stY;
                    X < dict.stX && (X = dict.stX);
                    X > setRig && (X = setRig);
                    Y < dict.stY && (Y = dict.stY);
                    Y > setBot && (Y = setBot);
                }

                layero.css({
                    left: X,
                    top: Y
                });
            }

            //Resize
            if (config.resize && dict.resizeStart) {
                var X = e.clientX - dict.offset[0],
                    Y = e.clientY - dict.offset[1];

                e.preventDefault();

                layer.style(that.index, {
                    width: dict.area[0] + X,
                    height: dict.area[1] + Y
                })
                dict.isResize = true;
                config.resizing && config.resizing(layero);
            }
        }).on('mouseup', function(e) {
            if (dict.moveStart) {
                delete dict.moveStart;
                ready.moveElem.hide();
                config.moveEnd && config.moveEnd(layero);
            }
            if (dict.resizeStart) {
                delete dict.resizeStart;
                ready.moveElem.hide();
            }
        });

        return that;
    };

    /**
     * 执行设定的回调函数(success等)
     * @return {undefined} 无返回值
     */
    Class.pt.callback = function() {
        var that = this,
            layero = that.layero,
            config = that.config;
        if (config.success) {
            config.success(layero, that.index);
        }

        //对按钮添加点击事件
        layero.find('.' + doms[6]).children('a').on('click', function() {
            var index = $(this).index();
            if (index === 0) {
                if (config.yes) {
                    config.yes(that.index, layero)
                } else if (config['btn1']) {
                    config['btn1'](that.index, layero)
                } else {
                    layer.close(that.index);
                }
            } else {
                var close = config['btn' + (index + 1)] && config['btn' + (index + 1)](that.index, layero);
                close === false || layer.close(that.index);
            }
        });

        /**
         * 取消时执行回掉函数
         * @return {undefined}
         */
        function cancel() {
            var close = config.cancel && config.cancel(that.index, layero);
            close === false || layer.close(that.index);
        }

        //右上角关闭回调
        layero.find('.' + doms[7]).on('click', cancel);

        //点遮罩关闭
        if (config.shadeClose) {
            $('#layui-layer-shade' + that.index).on('click', function() {
                layer.close(that.index);
            });
        }

        //最小化
        layero.find('.layui-layer-min').on('click', function() {
            var min = config.min && config.min(layero);
            min === false || layer.min(that.index, config);
        });

        //全屏/还原
        layero.find('.layui-layer-max').on('click', function() {
            if ($(this).hasClass('layui-layer-maxmin')) {
                layer.restore(that.index);
                config.restore && config.restore(layero);
            } else {
                layer.full(that.index, config);
                setTimeout(function() {
                    config.full && config.full(layero);
                }, 100);
            }
        });

        config.end && (ready.end[that.index] = config.end);
    };


    /** 内置成员 */

    window.layer = layer;

    /**
     * 设定制定层的样式，index必须
     * @param  {int} index   层的index
     * @param  {Object} options 指定样式
     * @param  {bool} limit   是否做出限制，可选
     * @return {[type]}         [description]
     */
    layer.style = function(index, options, limit) {
        var layero = $('#' + doms[0] + index),
            contElem = layero.find('.layui-layer-content'),
            type = layero.attr('type'),
            titHeight = layero.find(doms[1]).outerHeight() || 0,
            btnHeight = layero.find('.' + doms[6]).outerHeight() || 0;

        if (type === ready.type[3] || type === ready.type[4]) {
            return;
        }

        if (!limit) {
            if (parseFloat(options.width) <= 260) {
                options.width = 260;
            };

            if (parseFloat(options.height) - titHeight - btnHeight <= 64) {
                options.height = 64 + titHeight + btnHeight;
            };
        }

        layero.css(options);
        btnHeight = layero.find('.' + doms[6]).outerHeight();

        contElem.css({
            height: parseFloat(options.height) - titHeight - btnHeight - parseFloat(contElem.css('padding-top')) - parseFloat(contElem.css('padding-bottom'))
        })
    };


    //关闭layer总方法
    layer.close = function(index) {
        var layero = $('#' + doms[0] + index),
            type = layero.attr('type'),
            closeAnim = 'layer-anim-close';
        if (!layero[0]) return;
        var WRAP = 'layui-layer-wrap',
            remove = function() {
                if (type === ready.type[1] && layero.attr('conType') === 'object') {
                    layero.children(':not(.' + doms[5] + ')').remove();
                    var wrap = layero.find('.' + WRAP);
                    for (var i = 0; i < 2; i++) {
                        wrap.unwrap();
                    }
                    wrap.css('display', wrap.data('display')).removeClass(WRAP);
                } else {
                    layero[0].innerHTML = '';
                    layero.remove();
                }
                typeof ready.end[index] === 'function' && ready.end[index]();
                delete ready.end[index];
            };

        if (layero.data('anim')) {
            layero.addClass(closeAnim);
        }

        $('#layui-layer-moves, #layui-layer-shade' + index).remove();

        setTimeout(function() {
            remove();
        }, !layero.data('anim') ? 0 : 200);
    };

    //关闭所有层
    layer.closeAll = function(type) {
        $.each($('.' + doms[0]), function() {
            var othis = $(this);
            var is = type ? (othis.attr('type') === type) : 1;
            is && layer.close(othis.attr('times'));
            is = null;
        });
    };

    //主入口
    ready.run = function(_$) {
        $ = _$;
        win = $(window);
        doms.html = $('html');
        layer.open = function(deliver) {
            var o = new Class(deliver);
            return o.index;
        };
    };

    /**
     * 加载方式，暂时先保留吧留着以后
     * @param  {[type]} exports) {                        layer.path [description]
     * @return {[type]}          [description]
     */
    window.layui && layui.define ? (
        layer.ready(), layui.define('jquery', function(exports) { //layui加载
            layer.path = layui.cache.dir;
            ready.run(layui.jquery);

            //暴露模块
            window.layer = layer;
            exports('layer', layer);
        })
    ) : (
        typeof define === 'function' ? define(['jquery'], function() { //requirejs加载
            ready.run(window.jQuery);
            return layer;
        }) : function() { //普通script标签加载
            ready.run(window.jQuery);
            layer.ready();
        }()
    );

}(window);
