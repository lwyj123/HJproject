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

        //各种快捷引用
        msg: function(content, options, end) { //最常用提示层
            var type = typeof options === 'function',
                rskin = ready.config.skin;
            var skin = (rskin ? rskin + ' ' + rskin + '-msg' : '') || 'layui-layer-msg';
            var anim = doms.anim.length - 1;
            if (type) end = options;
            return layer.open($.extend({
                content: content,
                time: 3000,
                shade: false,
                skin: skin,
                title: false,
                closeBtn: false,
                btn: false,
                resize: false,
                end: end
            }, (type && !ready.config.skin) ? {
                skin: skin + ' layui-layer-hui',
                anim: anim
            } : function() {
                options = options || {};
                if (options.icon === -1 || options.icon === undefined && !ready.config.skin) {
                    options.skin = skin + ' ' + (options.skin || 'layui-layer-hui');
                }
                return options;
            }()));
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

    //默认配置
    Class.pt.config = {
        type: 0,
        shade: 0.3,
        fixed: true,
        move: doms[1],
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
     * @param  {Function} callback [description]
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
     * @return {[type]} [description]
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

        //anim兼容旧版shift
        if (config.shift) {
            config.anim = config.shift;
        }


        //依据情况初始化（比如关闭其他弹出层）
        switch (config.type) {
            case 0:
                config.btn = ('btn' in config) ? config.btn : ready.btn[0];
                layer.closeAll('dialog');
                break;
            case 2:
                delete config.title;
                delete config.closeBtn;
                config.icon === -1 && (config.icon === 0);
                layer.closeAll('loading');
                break;
        }

        //建立容器
        that.vessel(conType, function(html, titleHTML, moveElem) {
            body.append(html[0]);
            conType ? function() {
                (config.type == 2 || config.type == 4) ? function() {
                    $('body').append(html[1]);
                }() : function() {
                    if (!content.parents('.' + doms[0])[0]) {
                        content.data('display', content.css('display')).show().addClass('layui-layer-wrap').wrap(html[1]);
                        $('#' + doms[0] + times).find('.' + doms[5]).before(titleHTML);
                    }
                }();
            }() : body.append(html[1]);
            $('.layui-layer-move')[0] || body.append(ready.moveElem = moveElem);
            /**
             * layero是弹出窗的jquery对象
             * @type {object}
             */
            that.layero = $('#' + doms[0] + times);
            config.scrollbar || doms.html.css('overflow', 'hidden').attr('layer-full', times);
        }).auto(times);


        //坐标自适应浏览器窗口尺寸
        that.offset();
        if (config.fixed) {
            win.on('resize', function() {
                that.offset();
                (/^\d+%$/.test(config.area[0]) || /^\d+%$/.test(config.area[1])) && that.auto(times);
            });
        }

        config.time <= 0 || setTimeout(function() {
            layer.close(that.index)
        }, config.time);
        that.move().callback();

        //为兼容jQuery3.0的css动画影响元素尺寸计算
        if (doms.anim[config.anim]) {
            that.layero.addClass(doms.anim[config.anim]).data('anim', true);
        };
    };

    //自适应
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

        function setHeight(elem) {
            elem = layero.find(elem);
            elem.height(area[1] - titHeight - btnHeight - 2 * (parseFloat(elem.css('padding')) | 0));
        }
        switch (config.type) {

            default:
                if (config.area[1] === '') {
                    if (config.fixed && area[1] >= win.height()) {
                        area[1] = win.height();
                        setHeight('.' + doms[5]);
                    }
                } else {
                    setHeight('.' + doms[5]);
                }
                break;
        }
        return that;
    };

    //计算坐标
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

            if (config.offset === 't') { //上
                that.offsetTop = 0;
            } else if (config.offset === 'r') { //右
                that.offsetLeft = win.width() - area[0];
            } else if (config.offset === 'b') { //下
                that.offsetTop = win.height() - area[1];
            } else if (config.offset === 'l') { //左
                that.offsetLeft = 0;
            } else if (config.offset === 'lt') { //左上角
                that.offsetTop = 0;
                that.offsetLeft = 0;
            } else if (config.offset === 'lb') { //左下角
                that.offsetTop = win.height() - area[1];
                that.offsetLeft = 0;
            } else if (config.offset === 'rt') { //右上角
                that.offsetTop = 0;
                that.offsetLeft = win.width() - area[0];
            } else if (config.offset === 'rb') { //右下角
                that.offsetTop = win.height() - area[1];
                that.offsetLeft = win.width() - area[0];
            } else {
                that.offsetTop = config.offset;
            }

        }

        if (!config.fixed) {
            that.offsetTop = /%$/.test(that.offsetTop) ?
                win.height() * parseFloat(that.offsetTop) / 100 : parseFloat(that.offsetTop);
            that.offsetLeft = /%$/.test(that.offsetLeft) ?
                win.width() * parseFloat(that.offsetLeft) / 100 : parseFloat(that.offsetLeft);
            that.offsetTop += win.scrollTop();
            that.offsetLeft += win.scrollLeft();
        }


        layero.css({ top: that.offsetTop, left: that.offsetLeft });
    };

    //拖拽层
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

    Class.pt.callback = function() {
        var that = this,
            layero = that.layero,
            config = that.config;
        that.openLayer();
        if (config.success) {
            config.success(layero, that.index);
        }

        //按钮
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

        //取消
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

    //需依赖原型的对外方法
    Class.pt.openLayer = function() {
        var that = this;

        //置顶当前窗口
        layer.zIndex = that.config.zIndex;
        layer.setTop = function(layero) {
            var setZindex = function() {
                layer.zIndex++;
                layero.css('z-index', layer.zIndex + 1);
            };
            layer.zIndex = parseInt(layero[0].style.zIndex);
            layero.on('mousedown', setZindex);
            return layer.zIndex;
        };
    };


    /** 内置成员 */

    window.layer = layer;

    //设定层的样式
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

        if (type === ready.type[2]) {
            layero.find('iframe').css({
                height: parseFloat(options.height) - titHeight - btnHeight
            });
        } else {
            contElem.css({
                height: parseFloat(options.height) - titHeight - btnHeight - parseFloat(contElem.css('padding-top')) - parseFloat(contElem.css('padding-bottom'))
            })
        }
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
        ready.rescollbar(index);

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
