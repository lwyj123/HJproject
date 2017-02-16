/**

 @HJchat v0.0.1
 @Author：梁王
 @Site：
 @License：
    
基于贤心layim简化的，用于chatbot。
 */

! function(window, undefined) {
    "use strict";
    var v = '0.0.1';
    var $ = window.jquery;
    var layer = window.HJalert;
    var laytpl = layui.laytpl;
    var device = layui.device();

    var SHOW = 'layui-show',
        THIS = 'layim-this',
        MAX_ITEM = 20;

    //回调
    var call = {};

    //对外API
    var LAYIM = function() {
        this.v = v;
        $('body').on('click', '*[layim-event]', function(e) {
            var othis = $(this);
            var methid = othis.attr('layim-event');
            events[methid] ? events[methid].call(this, othis, e) : '';
        });
    };

    /**
     * 基础配置
     * @param  {Object} options 配置选项
     * @return {Object}         返回this便于链式调用
     */
    LAYIM.prototype.config = function(options) {
        var skin = [];
        layui.each(Array(5), function(index) {
            skin.push(layui.cache.dir + 'css/modules/layim/skin/' + (index + 1) + '.jpg')
        });
        options = options || {};
        options.skin = options.skin || [];
        layui.each(options.skin, function(index, item) {
            skin.unshift(item);
        });
        options.skin = skin;
        options = $.extend({
            isfriend: !0,
        }, options);
        if (!window.JSON || !window.JSON.parse) return;
        init(options);
        return this;
    };

    //监听事件
    /**
     * 监听事件 把对应回调函数加入call中
     * @param  {string}   events   事件
     * @param  {Function} callback 事件触发的回调函数
     * @return {Object}            返回this
     */
    LAYIM.prototype.on = function(events, callback) {
        if (typeof callback === 'function') {
            call[events] ? call[events].push(callback) : call[events] = [callback];
        }
        return this;
    };

    //获取所有缓存数据
    LAYIM.prototype.cache = function() {
        return cache;
    };

    //打开一个自定义的会话界面
    LAYIM.prototype.chat = function(data) {
        if (!window.JSON || !window.JSON.parse) return;
        return popchat(data), this;
    };

    //设置聊天界面最小化
    LAYIM.prototype.setChatMin = function() {
        setChatMin();
        return this;
    };

    //设置当前会话状态
    LAYIM.prototype.setChatStatus = function(str) {
        var thatChat = thisChat();
        if (!thatChat) return;
        var status = thatChat.elem.find('.layim-chat-status');
        status.html(str);
        return this;
    };

    //接受消息
    LAYIM.prototype.getMessage = function(data) {
        return getMessage(data), this;
    };

    //桌面消息通知
    LAYIM.prototype.notice = function(data) {
        return notice(data), this;
    };

    //消息盒子的提醒
    LAYIM.prototype.msgbox = function(nums) {
        return msgbox(nums), this;
    };

    //设置好友在线/离线状态
    LAYIM.prototype.setFriendStatus = function(id, type) {
        var list = $('#layim-friend' + id);
        list[type === 'online' ? 'removeClass' : 'addClass']('layim-list-gray');
    };

    //解析聊天内容
    LAYIM.prototype.content = function(content) {
        return layui.data.content(content);
    };


    //主模板
    var listTpl = function(options) {
        var nodata = {
            friend: "该分组下暂无好友",
            history: "暂无历史会话"
        };

        options = options || {};
        options.item = options.item || ('d.' + options.type);

        return ['{{# var length = 0; layui.each(' + options.item + ', function(i, data){ length++; }}', '<li layim-event="chat" data-type="' + options.type + '" data-index="{{ ' + (options.index || 'i') + ' }}" id="layim-' + options.type + '{{ data.id }}" {{ data.status === "offline" ? "class=layim-list-gray" : "" }}><img src="{{ data.avatar }}"><span>{{ data.username||data.name||"佚名" }}</span><p>{{ data.remark||data.sign||"" }}</p></li>', '{{# }); if(length === 0){ }}', '<li class="layim-null">' + (nodata[options.type] || "暂无数据") + '</li>', '{{# } }}'].join('');
    };

    var elemTpl = ['<div class="layui-layim-main">', '<div class="layui-layim-info">', '<div class="layui-layim-user">{{ d.mine.username }}</div>', '<div class="layui-layim-status">', '{{# if(d.mine.status === "online"){ }}', '<span class="layui-icon layim-status-online" layim-event="status" lay-type="show">&#xe617;</span>', '{{# } else if(d.mine.status === "hide") { }}', '<span class="layui-icon layim-status-hide" layim-event="status" lay-type="show">&#xe60f;</span>', '{{# } }}', '<ul class="layui-anim layim-menu-box">', '<li {{d.mine.status === "online" ? "class=layim-this" : ""}} layim-event="status" lay-type="online"><i class="layui-icon">&#xe618;</i><cite class="layui-icon layim-status-online">&#xe617;</cite>在线</li>', '<li {{d.mine.status === "hide" ? "class=layim-this" : ""}} layim-event="status" lay-type="hide"><i class="layui-icon">&#xe618;</i><cite class="layui-icon layim-status-hide">&#xe60f;</cite>隐身</li>', '</ul>', '</div>', '<input class="layui-layim-remark" placeholder="编辑签名" value="{{ d.mine.remark||d.mine.sign||"" }}"></p>', '</div>', '<ul class="layui-unselect layui-layim-tab{{# if(!d.base.isfriend){ }}', ' layim-tab-two', '{{# } }}">', '<li class="layui-icon', '{{# if(!d.base.isfriend){ }}', ' layim-hide', '{{# } else { }}', ' layim-this', '{{# } }}', '" title="联系人" layim-event="tab" lay-type="friend">&#xe612;</li>', '<li class="layui-icon" title="历史会话" layim-event="tab" lay-type="history">&#xe611;</li>', '</ul>', '<ul class="layui-unselect layim-tab-content {{# if(d.base.isfriend){ }}layui-show{{# } }} layim-list-friend">', '{{# layui.each(d.friend, function(index, item){ var spread = d.local["spread"+index]; }}', '<li>', '<h5 layim-event="spread" lay-type="{{ spread }}"><i class="layui-icon">{{# if(spread === "true"){ }}&#xe61a;{{# } else {  }}&#xe602;{{# } }}</i><em>(<cite class="layim-count"> {{ (item.list||[]).length }}</cite>)</em></h5>', '<ul class="layui-layim-list {{# if(spread === "true"){ }}', ' layui-show', '{{# } }}">', listTpl({
        type: "friend",
        item: "item.list",
        index: "index"
    }), '</ul>', '</li>', '</ul>', '<ul class="layui-unselect layim-tab-content  {{# if(!d.base.isfriend){ }}layui-show{{# } }}">', '<li>', '<ul class="layui-layim-list layui-show layim-list-history">', listTpl({
        type: 'history'
    }), '</ul>', '</li>', '</ul>', '<ul class="layui-unselect layim-tab-content">', '<li>', '<ul class="layui-layim-list layui-show" id="layui-layim-search"></ul>', '</li>', '</ul>', '<ul class="layui-unselect layui-layim-tool">', '<li class="layui-icon layim-tool-search" layim-event="search" title="搜索">&#xe615;</li>', '{{# if(d.base.msgbox){ }}', '<li class="layui-icon layim-tool-msgbox" layim-event="msgbox" title="消息盒子">&#xe645;<span class="layui-anim"></span></li>', '{{# } }}', '{{# if(d.base.find){ }}', '<li class="layui-icon layim-tool-find" layim-event="find" title="查找">&#xe608;</li>', '{{# } }}', '<li class="layui-icon layim-tool-skin" layim-event="skin" title="更换背景">&#xe61b;</li>', '{{# if(!d.base.copyright){ }}', '<li class="layui-icon layim-tool-about" layim-event="about" title="关于">&#xe60b;</li>', '{{# } }}', '</ul>', '<div class="layui-layim-search"><input><label class="layui-icon" layim-event="closeSearch">&#x1007;</label></div>', '</div>'].join('');

    //换肤模版
    var elemSkinTpl = ['<ul class="layui-layim-skin">', '{{# layui.each(d.skin, function(index, item){ }}', '{{# }); }}', '</ul>'].join('');

    //聊天主模板
    var elemChatTpl = ['<div style="display: block;" class="layim-chat layim-chat-{{d.data.type}}">', '<div class="layui-unselect layim-chat-title">', '<div class="layim-chat-other">', '<span class="layim-chat-username">{{ d.data.name||"佚名" }} </span>', '<p class="layim-chat-status"></p>', '</div>', '</div>', '<div class="layim-chat-main">', '<ul></ul>', '</div>', '<div class="layim-chat-footer">', '<div class="layui-unselect layim-chat-tool" data-json="{{encodeURIComponent(JSON.stringify(d.data))}}">', '<span class="layui-icon layim-tool-face" title="选择表情" layim-event="face">&#xe60c;</span>', '{{# if(d.base && d.base.uploadImage){ }}', '<span class="layui-icon layim-tool-image" title="上传图片" layim-event="image">&#xe60d;<input type="file" name="file"></span>', '{{# layui.each(d.base.tool, function(index, item){ }}', '<span class="layui-icon layim-tool-{{item.alias}}" title="{{item.title}}" layim-event="extend" lay-filter="{{ item.alias }}">{{item.icon}}</span>', '{{# }); }}', '{{# }; }}', '</div>', '<div class="layim-chat-textarea"><textarea></textarea></div>', '<div class="layim-chat-bottom">', '<div class="layim-chat-send">', '{{# if(!d.base.brief){ }}', '<span class="layim-send-close" layim-event="closeThisChat">关闭</span>', '{{# } }}', '<span class="layim-send-btn" layim-event="send">发送</span>', '</div>', '</div>', '</div>', '</div>'].join('');

    //聊天内容列表模版
    var elemChatMain = ['<li {{ d.mine ? "class=layim-chat-mine" : "" }} {{# if(d.cid){ }}data-cid="{{d.cid}}"{{# } }}>', '<div class="layim-chat-user"><img src="{{ d.avatar }}"><cite>', '{{# if(d.mine){ }}', '<i>{{ layui.data.date(d.timestamp) }}</i>{{ d.username||"佚名" }}', '{{# } else { }}', '{{ d.username||"佚名" }}<i>{{ layui.data.date(d.timestamp) }}</i>', '{{# } }}', '</cite></div>', '<div class="layim-chat-text">{{ layui.data.content(d.content||"&nbsp") }}</div>', '</li>'].join('');

    var elemChatList = '<li class="layim-chatlist-{{ d.data.type }}{{ d.data.id }} layim-this" layim-event="tabChat"><img src="{{ d.data.avatar }}"><span>{{ d.data.name||"佚名" }}</span>{{# if(!d.base.brief){ }}<i class="layui-icon" layim-event="closeChat">&#x1007;</i>{{# } }}</li>';

    //补齐数位
    var digit = function(num) {
        return num < 10 ? '0' + (num | 0) : num;
    };

    //转换时间
    layui.data.date = function(timestamp) {
        var d = new Date(timestamp || new Date());
        return d.getFullYear() + '-' + digit(d.getMonth() + 1) + '-' + digit(d.getDate()) + ' ' + digit(d.getHours()) + ':' + digit(d.getMinutes()) + ':' + digit(d.getSeconds());
    };

    /**
     * 转义聊天内容，可以实现表情链接图片等的转义
     * @param  {String} content 输入的内容
     * @return {String}         转义后的内容
     */
    layui.data.content = function(content) {
        //支持的html标签
        var html = function(end) {
            return new RegExp('\\n*\\[' + (end || '') + '(pre|div|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
        };
        content = (content || '').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;') //XSS
            .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2') //转义@

        .replace(/file\([\s\S]+?\)\[[\s\S]*?\]/g, function(str) { //转义文件
            var href = (str.match(/file\(([\s\S]+?)\)\[/) || [])[1];
            var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
            if (!href) return str;
            return '<a class="layui-layim-file" href="' + href + '" download target="_blank"><i class="layui-icon">&#xe61e;</i><cite>' + (text || href) + '</cite></a>';
        })

        .replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
            .replace(/\n/g, '<br>') //转义换行 
        return content;
    };

    //Ajax
    var post = function(options, callback, tips) {
        options = options || {};
        return $.ajax({
            url: options.url,
            type: options.type || 'get',
            data: options.data,
            dataType: options.dataType || 'json',
            cache: false,
            success: function(res) {
                res.code == 0 ? callback && callback(res.data || {}) : HJalert.msg(res.msg || ((tips || 'Error') + ': LAYIM_NOT_GET_DATA'), {
                    time: 5000
                });
            },
            error: function(err, msg) {
                window.console && console.log && console.error('LAYIM_DATE_ERROR：' + msg);
            }
        });
    };

    //处理初始化信息
    var cache = {
        message: {},
        chat: []
    };
    var init = function(options) {
        var init = options.init || {}
        mine = init.mine || {}, local = layui.data('layim')[mine.id] || {}, obj = {
            base: options,
            local: local,
            mine: mine,
            history: local.history || {}
        };
        var create = function(data) {
            var mine = data.mine || {};
            var local = layui.data('layim')[mine.id] || {};
            var obj = {
                base: options, //基础配置信息                      
                local: local, //本地数据                     
                mine: mine, //我的用户信息          
                friend: data.friend || [], //联系人信息             
                history: local.history || {} //历史会话信息
            };
            cache = $.extend(cache, obj);
            layui.each(call.ready, function(index, item) {
                item && item(obj);
            });
        };
        cache = $.extend(cache, obj);
        if (options.brief) {
            return layui.each(call.ready, function(index, item) {
                item && item(obj);
            });
        };
        init.url ? post(init, create, 'INIT') : create(init);
    };


    //显示聊天面板

    var layimChat;
    var layimMin;
    var chatIndex;
    var To = {};
    /**
     * 核心，显示聊天界面
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    var popchat = function(data) {
        data = data || {};

        var chat = $('#layui-layim-chat'),
            render = {
                data: data,
                base: cache.base,
                local: cache.local
            };

        if (!data.id) {
            return HJalert.msg('非法用户');
        }

        if (chat[0]) {
            var list = layimChat.find('.layim-chat-list');
            var listThat = list.find('.layim-chatlist-' + data.type + data.id);
            var hasFull = layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin');
            var chatBox = chat.children('.layim-chat-box');

            //如果是最小化，则还原窗口
            if (layimChat.css('display') === 'none') {
                layimChat.show();
            }

            if (layimMin) {
                HJalert.close(layimMin.attr('times'));
            }

            //如果出现多个聊天面板
            if (list.find('li').length === 1 && !listThat[0]) {
                hasFull || layimChat.css('width', 800);
                list.css({
                    height: layimChat.height()
                }).show();
                chatBox.css('margin-left', '200px');
            }

            //打开的是非当前聊天面板，则新增面板
            if (!listThat[0]) {
                list.append(laytpl(elemChatList).render(render));
                chatBox.append(laytpl(elemChatTpl).render(render));
            }

            listThat[0] || viewChatlog();

            return chatIndex;
        }

        render.first = !0;

        var index = chatIndex = HJalert.open({
            type: 1,
            area: '600px',
            skin: 'layui-box layui-layim-chat',
            id: 'layui-layim-chat',
            title: '&#8203;',
            shade: false,
            maxmin: true,
            offset: data.offset || 'auto',
            anim: data.anim || 0,
            closeBtn: cache.base.brief ? false : 1,
            content: laytpl('<ul class="layui-unselect layim-chat-list">' + elemChatList + '</ul><div class="layim-chat-box">' + elemChatTpl + '</div>').render(render),
            success: function(layero) {
                layimChat = layero;

                layero.css({
                    'min-width': '500px',
                    'min-height': '420px'
                });

                typeof data.success === 'function' && data.success(layero);


                viewChatlog();
                showOffMessage();

                //聊天窗口的切换监听
                layui.each(call.chatChange, function(index, item) {
                    item && item(thisChat());
                });

                //查看大图
                layero.on('dblclick', '.layui-layim-photos', function() {
                    var src = this.src;
                    layer.close(popchat.photosIndex);
                    layer.photos({
                        photos: {
                            data: [{
                                "alt": "大图模式",
                                "src": src
                            }]
                        },
                        shade: 0.01,
                        closeBtn: 2,
                        anim: 0,
                        resize: false,
                        success: function(layero, index) {
                            popchat.photosIndex = index;
                        }
                    });
                });
            },
            full: function(layero) {
                layer.style(index, {
                    width: '100%',
                    height: '100%'
                }, true);
            },
            min: function() {
                setChatMin();
                return false;
            },
            end: function() {
                layer.closeAll('tips');
                layimChat = null;
            }
        });
        return index;
    };



    //设置聊天窗口最小化 & 新消息提醒
    var setChatMin = function(newMsg) {
        var thatChat = newMsg || thisChat().data,
            base = layui.layim.cache().base;
        if (layimChat && !newMsg) {
            layimChat.hide();
        }
        layer.close(setChatMin.index);
        setChatMin.index = layer.open({
            type: 1,
            title: false,
            skin: 'layui-box layui-layim-min',
            shade: false,
            closeBtn: false,
            anim: thatChat.anim || 2,
            offset: 'b',
            move: '#layui-layim-min',
            resize: false,
            area: ['182px', '50px'],
            content: '<img id="layui-layim-min" src="' + thatChat.avatar + '"><span>' + thatChat.name + '</span>',
            success: function(layero, index) {
                if (!newMsg) layimMin = layero;

                if (base.minRight) {
                    layer.style(index, {
                        left: $(window).width() - layero.outerWidth() - parseFloat(base.minRight)
                    });
                }

                layero.find('.layui-layer-content span').on('click', function() {
                    layer.close(index);
                    newMsg ? layui.each(cache.chat, function(i, item) {
                        popchat(item);
                    }) : layimChat.show();
                    if (newMsg) {
                        cache.chat = [];
                        chatListMore();
                    }
                });
                layero.find('.layui-layer-content img').on('click', function(e) {
                    stope(e);
                });
            }
        });
    };


    //展示存在队列中的消息
    var showOffMessage = function() {
        var thatChat = thisChat();
        var message = cache.message[thatChat.data.type + thatChat.data.id];
        if (message) {
            //展现后，删除队列中消息
            delete cache.message[thatChat.data.type + thatChat.data.id];
        }
    };

    //获取当前聊天面板
    var thisChat = function() {
        if (!layimChat) return;
        var index = $('.layim-chat-list .' + THIS).index();
        var cont = layimChat.find('.layim-chat').eq(index);
        var to = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
        return {
            elem: cont,
            data: to,
            textarea: cont.find('textarea')
        };
    };

    //发送消息
    var sendMessage = function() {
        var data = {
            username: cache.mine ? cache.mine.username : '访客',
            avatar: cache.mine ? cache.mine.avatar : (layui.cache.dir + 'css/pc/layim/skin/logo.jpg'),
            id: cache.mine ? cache.mine.id : null,
            mine: true
        };
        var thatChat = thisChat(),
            ul = thatChat.elem.find('.layim-chat-main ul');
        var maxLength = cache.base.maxLength || 3000;
        data.content = thatChat.textarea.val();
        if (data.content.replace(/\s/g, '') !== '') {

            if (data.content.length > maxLength) {
                return layer.msg('内容最长不能超过' + maxLength + '个字符')
            }

            ul.append(laytpl(elemChatMain).render(data));

            var param = {
                    mine: data,
                    to: thatChat.data
                },
                message = {
                    username: param.mine.username,
                    avatar: param.mine.avatar,
                    id: param.to.id,
                    type: param.to.type,
                    content: param.mine.content,
                    timestamp: new Date().getTime(),
                    mine: true
                };
            pushChatlog(message);

            layui.each(call.sendMessage, function(index, item) {
                item && item(param);
            });
        }
        chatListMore();
        thatChat.textarea.val('').focus();
    };

    //桌面消息提醒
    var notice = function(data) {
        data = data || {};
        if (window.Notification) {
            if (Notification.permission === 'granted') {
                var notification = new Notification(data.title || '', {
                    body: data.content || '',
                    icon: data.avatar || 'http://tp2.sinaimg.cn/5488749285/50/5719808192/1'
                });
            } else {
                Notification.requestPermission();
            };
        }
    };

    //接受消息
    var messageNew = {},
        getMessage = function(data) {
            data = data || {};

            var elem = $('.layim-chatlist-' + data.type + data.id);
            var index = elem.index();

            data.timestamp = data.timestamp || new Date().getTime();
            if (data.fromid == cache.mine.id) {
                data.mine = true;
            }
            data.system || pushChatlog(data);
            messageNew = JSON.parse(JSON.stringify(data));

            if ((!layimChat && data.content) || index === -1) {
                if (cache.message[data.type + data.id]) {
                    cache.message[data.type + data.id].push(data)
                } else {
                    cache.message[data.type + data.id] = [data];

                    //记录聊天面板队列
                    if (data.type === 'friend') {
                        var friend;
                        layui.each(cache.friend, function(index1, item1) {
                            layui.each(item1.list, function(index, item) {
                                if (item.id == data.id) {
                                    item.type = 'friend';
                                    item.name = item.username;
                                    cache.chat.push(item);
                                    return friend = true;
                                }
                            });
                            if (friend) return true;
                        });
                        if (!friend) {
                            data.name = data.username;
                            data.temporary = true; //临时会话
                            cache.chat.push(data);
                        }
                    } else {
                        data.name = data.name || data.username;
                        cache.chat.push(data);
                    }
                }

                if (!data.system) {
                    if (cache.base.notice) {
                        notice({
                            title: '来自 ' + data.username + ' 的消息',
                            content: data.content,
                            avatar: data.avatar
                        });
                    }
                    return setChatMin({
                        name: '收到新消息',
                        avatar: data.avatar,
                        anim: 6
                    });
                }
            }

            if (!layimChat) return;

            //接受到的消息不在当前Tab
            var thatChat = thisChat();
            if (thatChat.data.type + thatChat.data.id !== data.type + data.id) {
                elem.addClass('layui-anim layer-anim-06');
                setTimeout(function() {
                    elem.removeClass('layui-anim layer-anim-06')
                }, 300);
            }

            var cont = layimChat.find('.layim-chat').eq(index);
            var ul = cont.find('.layim-chat-main ul');

            //系统消息
            if (data.system) {
                if (index !== -1) {
                    ul.append('<li class="layim-chat-system"><span>' + data.content + '</span></li>');
                }
            } else if (data.content.replace(/\s/g, '') !== '') {
                ul.append(laytpl(elemChatMain).render(data));
            }

            chatListMore();
        };

    //存储最近MAX_ITEM条聊天记录到本地
    var pushChatlog = function(message) {
        var local = layui.data('layim')[cache.mine.id] || {};
        local.chatlog = local.chatlog || {};
        var thisChatlog = local.chatlog[message.type + message.id];
        if (thisChatlog) {
            //避免浏览器多窗口时聊天记录重复保存
            var nosame;
            layui.each(thisChatlog, function(index, item) {
                if ((item.timestamp === message.timestamp && item.type === message.type && item.id === message.id && item.content === message.content)) {
                    nosame = true;
                }
            });
            if (!(nosame || message.fromid == cache.mine.id)) {
                thisChatlog.push(message);
            }
            if (thisChatlog.length > MAX_ITEM) {
                thisChatlog.shift();
            }
        } else {
            local.chatlog[message.type + message.id] = [message];
        }
        layui.data('layim', {
            key: cache.mine.id,
            value: local
        });
    };

    //渲染本地最新聊天记录到相应面板
    var viewChatlog = function() {
        var local = layui.data('layim')[cache.mine.id] || {},
            thatChat = thisChat(),
            chatlog = local.chatlog || {},
            ul = thatChat.elem.find('.layim-chat-main ul');
        layui.each(chatlog[thatChat.data.type + thatChat.data.id], function(index, item) {
            ul.append(laytpl(elemChatMain).render(item));
        });
        chatListMore();
    };

    //查看更多记录
    var chatListMore = function() {
        var thatChat = thisChat(),
            chatMain = thatChat.elem.find('.layim-chat-main');
        var ul = chatMain.find('ul');
        var length = ul.find('li').length;

        if (length >= MAX_ITEM) {
            var first = ul.find('li').eq(0);
            if (!ul.prev().hasClass('layim-chat-system')) {
                ul.before('<div class="layim-chat-system"></div>');
            }
            if (length > MAX_ITEM) {
                first.remove();
            }
        }
        chatMain.scrollTop(chatMain[0].scrollHeight + 1000);
        chatMain.find('ul li:last').find('img').load(function() {
            chatMain.scrollTop(chatMain[0].scrollHeight + 1000);
        });
    };

    var stope = layui.stope; //组件事件冒泡

    //在焦点处插入内容
    var focusInsert = function(obj, str) {
        var result, val = obj.value;
        obj.focus();
        if (document.selection) { //ie
            result = document.selection.createRange();
            document.selection.empty();
            result.text = str;
        } else {
            result = [val.substring(0, obj.selectionStart), str, val.substr(obj.selectionEnd)];
            obj.focus();
            obj.value = result.join('');
        }
    };

    //事件
    var anim = 'layui-anim-upbit';
    var events = {
        //在线状态
        status: function(othis, e) {
            var hide = function() {
                othis.next().hide().removeClass(anim);
            };
            var type = othis.attr('lay-type');
            if (type === 'show') {
                stope(e);
                othis.next().show().addClass(anim);
                $(document).off('click', hide).on('click', hide);
            } else {
                var prev = othis.parent().prev();
                othis.addClass(THIS).siblings().removeClass(THIS);
                prev.html(othis.find('cite').html());
                prev.removeClass('layim-status-' + (type === 'online' ? 'hide' : 'online'))
                    .addClass('layim-status-' + type);
                layui.each(call.online, function(index, item) {
                    item && item(type);
                });
            }
        },

        //弹出查找页面
        find: function() {
            layer.close(events.find.index);
            return events.find.index = layer.open({
                type: 2,
                title: '查找',
                shade: false,
                maxmin: true,
                area: ['1000px', '520px'],
                skin: 'layui-box layui-layer-border',
                resize: false,
                content: cache.base.find
            });
        },

        //弹出更换背景
        skin: function() {
            layer.open({
                type: 1,
                title: '更换背景',
                shade: false,
                area: '300px',
                skin: 'layui-box layui-layer-border',
                id: 'layui-layim-skin',
                zIndex: 66666666,
                resize: false,
                content: laytpl(elemSkinTpl).render({
                    skin: cache.base.skin
                })
            });
        },

        //关于
        about: function() {
            layer.alert('版本： ' + v + '<br>当前版本基于layim魔改，当前' + v + '版权所有：<a href="http://layim.layui.com" target="_blank">layim.layui.com</a>', {
                title: '关于 LayIM',
                shade: false
            });
        },

        //弹出聊天面板
        chat: function(othis) {
            var local = layui.data('layim')[cache.mine.id] || {};
            var type = othis.data('type'),
                index = othis.data('index');
            var list = othis.attr('data-list') || othis.index(),
                data = {};
            if (type === 'friend') {
                data = cache[type][index].list[list];
            } else if (type === 'history') {
                data = (local.history || {})[index] || {};
            }
            data.name = data.name || data.username;
            if (type !== 'history') {
                data.type = type;
            }
            popchat(data);
        },


        //发送聊天内容
        send: function() {
            sendMessage();
        },


        //图片或一般文件
        image: function(othis) {
            var type = othis.data('type') || 'images',
                api = {
                    images: 'uploadImage',
                    file: 'uploadFile'
                },
                thatChat = thisChat(),
                upload = cache.base[api[type]] || {};

            layui.upload({
                url: upload.url || '',
                method: upload.type,
                elem: othis.find('input')[0],
                unwrap: true,
                type: type,
                success: function(res) {
                    if (res.code == 0) {
                        res.data = res.data || {};
                        if (type === 'images') {
                            focusInsert(thatChat.textarea[0], 'img[' + (res.data.src || '') + ']');
                        } else if (type === 'file') {
                            focusInsert(thatChat.textarea[0], 'file(' + (res.data.src || '') + ')[' + (res.data.name || '下载文件') + ']');
                        }
                        sendMessage();
                    } else {
                        layer.msg(res.msg || '上传失败');
                    }
                }
            });
        },

        //扩展工具栏
        extend: function(othis) {
            var filter = othis.attr('lay-filter'),
                thatChat = thisChat();

            layui.each(call['tool(' + filter + ')'], function(index, item) {
                item && item.call(othis, function(content) {
                    focusInsert(thatChat.textarea[0], content);
                }, sendMessage, thatChat);
            });
        },

    };

    //暴露接口
    exports('layim', new LAYIM());


}(window);
