/**

 @HJchat v0.0.1
 @Author：梁王
 @Site：
 @License：
    
基于贤心HJchat简化的，用于chatbot。
 */

! function(window, undefined) {
    "use strict";
    var v = '0.0.1';
    var $ = window.jquery;
    var layer = window.HJalert;
    var laytpl = HJproject.laytpl;
    var device = HJproject.device();

    var SHOW = 'HJproject-show',
        THIS = 'HJchat-this',
        MAX_ITEM = 20;

    //回调
    var call = {};

    //对外API
    var LAYIM = function() {
        this.v = v;
        $('body').on('click', '*[HJchat-event]', function(e) {
            var othis = $(this);
            var methid = othis.attr('HJchat-event');
            events[methid] ? events[methid].call(this, othis, e) : '';
        });
    };

    /**
     * 基础配置
     * @param  {Object} options 配置选项
     * @return {Object}         返回this便于链式调用
     */
    LAYIM.prototype.config = function(options) {

        options = options || {};
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
        var status = thatChat.elem.find('.HJchat-chat-status');
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
        var list = $('#HJchat-friend' + id);
        list[type === 'online' ? 'removeClass' : 'addClass']('HJchat-list-gray');
    };

    //解析聊天内容
    LAYIM.prototype.content = function(content) {
        return HJproject.data.content(content);
    };


    //主模板
    var listTpl = function(options) {
        var nodata = {
            friend: "该分组下暂无好友",
            history: "暂无历史会话"
        };

        options = options || {};
        options.item = options.item || ('d.' + options.type);

        return ['{{# var length = 0; HJproject.each(' + options.item + ', function(i, data){ length++; }}', '<li HJchat-event="chat" data-type="' + options.type + '" data-index="{{ ' + (options.index || 'i') + ' }}" id="HJchat-' + options.type + '{{ data.id }}" {{ data.status === "offline" ? "class=HJchat-list-gray" : "" }}><img src="{{ data.avatar }}"><span>{{ data.username||data.name||"佚名" }}</span><p>{{ data.remark||data.sign||"" }}</p></li>', '{{# }); if(length === 0){ }}', '<li class="HJchat-null">' + (nodata[options.type] || "暂无数据") + '</li>', '{{# } }}'].join('');
    };

    var elemTpl = ['<div class="HJproject-HJchat-main">', '<div class="HJproject-HJchat-info">', '<div class="HJproject-HJchat-user">{{ d.mine.username }}</div>', '<div class="HJproject-HJchat-status">', '{{# if(d.mine.status === "online"){ }}', '<span class="HJproject-icon HJchat-status-online" HJchat-event="status" lay-type="show">&#xe617;</span>', '{{# } else if(d.mine.status === "hide") { }}', '<span class="HJproject-icon HJchat-status-hide" HJchat-event="status" lay-type="show">&#xe60f;</span>', '{{# } }}', '<ul class="HJproject-anim HJchat-menu-box">', '<li {{d.mine.status === "online" ? "class=HJchat-this" : ""}} HJchat-event="status" lay-type="online"><i class="HJproject-icon">&#xe618;</i><cite class="HJproject-icon HJchat-status-online">&#xe617;</cite>在线</li>', '<li {{d.mine.status === "hide" ? "class=HJchat-this" : ""}} HJchat-event="status" lay-type="hide"><i class="HJproject-icon">&#xe618;</i><cite class="HJproject-icon HJchat-status-hide">&#xe60f;</cite>隐身</li>', '</ul>', '</div>', '<input class="HJproject-HJchat-remark" placeholder="编辑签名" value="{{ d.mine.remark||d.mine.sign||"" }}"></p>', '</div>', '<ul class="HJproject-unselect HJproject-HJchat-tab{{# if(!d.base.isfriend){ }}', ' HJchat-tab-two', '{{# } }}">', '<li class="HJproject-icon', '{{# if(!d.base.isfriend){ }}', ' HJchat-hide', '{{# } else { }}', ' HJchat-this', '{{# } }}', '" title="联系人" HJchat-event="tab" lay-type="friend">&#xe612;</li>', '<li class="HJproject-icon" title="历史会话" HJchat-event="tab" lay-type="history">&#xe611;</li>', '</ul>', '<ul class="HJproject-unselect HJchat-tab-content {{# if(d.base.isfriend){ }}HJproject-show{{# } }} HJchat-list-friend">', '{{# HJproject.each(d.friend, function(index, item){ var spread = d.local["spread"+index]; }}', '<li>', '<h5 HJchat-event="spread" lay-type="{{ spread }}"><i class="HJproject-icon">{{# if(spread === "true"){ }}&#xe61a;{{# } else {  }}&#xe602;{{# } }}</i><em>(<cite class="HJchat-count"> {{ (item.list||[]).length }}</cite>)</em></h5>', '<ul class="HJproject-HJchat-list {{# if(spread === "true"){ }}', ' HJproject-show', '{{# } }}">', listTpl({
        type: "friend",
        item: "item.list",
        index: "index"
    }), '</ul>', '</li>', '</ul>', '<ul class="HJproject-unselect HJchat-tab-content  {{# if(!d.base.isfriend){ }}HJproject-show{{# } }}">', '<li>', '<ul class="HJproject-HJchat-list HJproject-show HJchat-list-history">', listTpl({
        type: 'history'
    }), '</ul>', '</li>', '</ul>', '<ul class="HJproject-unselect HJchat-tab-content">', '<li>', '<ul class="HJproject-HJchat-list HJproject-show" id="HJproject-HJchat-search"></ul>', '</li>', '</ul>', '<ul class="HJproject-unselect HJproject-HJchat-tool">', '<li class="HJproject-icon HJchat-tool-search" HJchat-event="search" title="搜索">&#xe615;</li>', '{{# if(d.base.msgbox){ }}', '<li class="HJproject-icon HJchat-tool-msgbox" HJchat-event="msgbox" title="消息盒子">&#xe645;<span class="HJproject-anim"></span></li>', '{{# } }}', '{{# if(d.base.find){ }}', '<li class="HJproject-icon HJchat-tool-find" HJchat-event="find" title="查找">&#xe608;</li>', '{{# } }}', '{{# if(!d.base.copyright){ }}', '<li class="HJproject-icon HJchat-tool-about" HJchat-event="about" title="关于">&#xe60b;</li>', '{{# } }}', '</ul>', '<div class="HJproject-HJchat-search"><input><label class="HJproject-icon" HJchat-event="closeSearch">&#x1007;</label></div>', '</div>'].join('');

 
    //聊天主模板
    var elemChatTpl = ['<div style="display: block;" class="HJchat-chat HJchat-chat-{{d.data.type}}">', '<div class="HJproject-unselect HJchat-chat-title">', '<div class="HJchat-chat-other">', '<span class="HJchat-chat-username">{{ d.data.name||"佚名" }} </span>', '<p class="HJchat-chat-status"></p>', '</div>', '</div>', '<div class="HJchat-chat-main">', '<ul></ul>', '</div>', '<div class="HJchat-chat-footer">', '<div class="HJproject-unselect HJchat-chat-tool" data-json="{{encodeURIComponent(JSON.stringify(d.data))}}">', '<span class="HJproject-icon HJchat-tool-face" title="选择表情" HJchat-event="face">&#xe60c;</span>', '{{# if(d.base && d.base.uploadImage){ }}', '<span class="HJproject-icon HJchat-tool-image" title="上传图片" HJchat-event="image">&#xe60d;<input type="file" name="file"></span>', '{{# HJproject.each(d.base.tool, function(index, item){ }}', '<span class="HJproject-icon HJchat-tool-{{item.alias}}" title="{{item.title}}" HJchat-event="extend" lay-filter="{{ item.alias }}">{{item.icon}}</span>', '{{# }); }}', '{{# }; }}', '</div>', '<div class="HJchat-chat-textarea"><textarea></textarea></div>', '<div class="HJchat-chat-bottom">', '<div class="HJchat-chat-send">', '{{# if(!d.base.brief){ }}', '<span class="HJchat-send-close" HJchat-event="closeThisChat">关闭</span>', '{{# } }}', '<span class="HJchat-send-btn" HJchat-event="send">发送</span>', '</div>', '</div>', '</div>', '</div>'].join('');

    //聊天内容列表模版
    var elemChatMain = ['<li {{ d.mine ? "class=HJchat-chat-mine" : "" }} {{# if(d.cid){ }}data-cid="{{d.cid}}"{{# } }}>', '<div class="HJchat-chat-user"><img src="{{ d.avatar }}"><cite>', '{{# if(d.mine){ }}', '<i>{{ HJproject.data.date(d.timestamp) }}</i>{{ d.username||"佚名" }}', '{{# } else { }}', '{{ d.username||"佚名" }}<i>{{ HJproject.data.date(d.timestamp) }}</i>', '{{# } }}', '</cite></div>', '<div class="HJchat-chat-text">{{ HJproject.data.content(d.content||"&nbsp") }}</div>', '</li>'].join('');

    var elemChatList = '<li class="HJchat-chatlist-{{ d.data.type }}{{ d.data.id }} HJchat-this" HJchat-event="tabChat"><img src="{{ d.data.avatar }}"><span>{{ d.data.name||"佚名" }}</span>{{# if(!d.base.brief){ }}<i class="HJproject-icon" HJchat-event="closeChat">&#x1007;</i>{{# } }}</li>';

    //补齐数位
    var digit = function(num) {
        return num < 10 ? '0' + (num | 0) : num;
    };

    //转换时间
    HJproject.data.date = function(timestamp) {
        var d = new Date(timestamp || new Date());
        return d.getFullYear() + '-' + digit(d.getMonth() + 1) + '-' + digit(d.getDate()) + ' ' + digit(d.getHours()) + ':' + digit(d.getMinutes()) + ':' + digit(d.getSeconds());
    };

    /**
     * 转义聊天内容，可以实现表情链接图片等的转义
     * @param  {String} content 输入的内容
     * @return {String}         转义后的内容
     */
    HJproject.data.content = function(content) {
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
            return '<a class="HJproject-HJchat-file" href="' + href + '" download target="_blank"><i class="HJproject-icon">&#xe61e;</i><cite>' + (text || href) + '</cite></a>';
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
        mine = init.mine || {}, local = HJproject.data('HJchat')[mine.id] || {}, obj = {
            base: options,
            local: local,
            mine: mine,
            history: local.history || {}
        };
        var create = function(data) {
            var mine = data.mine || {};
            var local = HJproject.data('HJchat')[mine.id] || {};
            var obj = {
                base: options, //基础配置信息                      
                local: local, //本地数据                     
                mine: mine, //我的用户信息          
                friend: data.friend || [], //联系人信息             
                history: local.history || {} //历史会话信息
            };
            cache = $.extend(cache, obj);
            HJproject.each(call.ready, function(index, item) {
                item && item(obj);
            });
        };
        cache = $.extend(cache, obj);
        if (options.brief) {
            return HJproject.each(call.ready, function(index, item) {
                item && item(obj);
            });
        };
        init.url ? post(init, create, 'INIT') : create(init);
    };


    //显示聊天面板

    var HJchatChat;
    var HJchatMin;
    var chatIndex;
    var To = {};
    /**
     * 核心，显示聊天界面
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    var popchat = function(data) {
        data = data || {};

        var chat = $('#HJproject-HJchat-chat'),
            render = {
                data: data,
                base: cache.base,
                local: cache.local
            };

        if (!data.id) {
            return HJalert.msg('非法用户');
        }

        if (chat[0]) {
            var list = HJchatChat.find('.HJchat-chat-list');
            var listThat = list.find('.HJchat-chatlist-' + data.type + data.id);
            var hasFull = HJchatChat.find('.HJproject-layer-max').hasClass('HJproject-layer-maxmin');
            var chatBox = chat.children('.HJchat-chat-box');

            //如果是最小化，则还原窗口
            if (HJchatChat.css('display') === 'none') {
                HJchatChat.show();
            }

            if (HJchatMin) {
                HJalert.close(HJchatMin.attr('times'));
            }

            //如果出现多个聊天面板
            if (list.find('li').length === 1 && !listThat[0]) {
                hasFull || HJchatChat.css('width', 800);
                list.css({
                    height: HJchatChat.height()
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
            id: 'HJproject-HJchat-chat',
            title: '&#8203;',
            shade: false,
            maxmin: true,
            offset: data.offset || 'auto',
            anim: data.anim || 0,
            closeBtn: cache.base.brief ? false : 1,
            content: laytpl('<ul class="HJproject-unselect HJchat-chat-list">' + elemChatList + '</ul><div class="HJchat-chat-box">' + elemChatTpl + '</div>').render(render),
            success: function(layero) {
                HJchatChat = layero;

                layero.css({
                    'min-width': '500px',
                    'min-height': '420px'
                });

                typeof data.success === 'function' && data.success(layero);


                viewChatlog();
                showOffMessage();

                //聊天窗口的切换监听
                HJproject.each(call.chatChange, function(index, item) {
                    item && item(thisChat());
                });

                //查看大图
                layero.on('dblclick', '.HJproject-HJchat-photos', function() {
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
                HJchatChat = null;
            }
        });
        return index;
    };



    //设置聊天窗口最小化 & 新消息提醒
    var setChatMin = function(newMsg) {
        var thatChat = newMsg || thisChat().data,
            base = HJproject.HJchat.cache().base;
        if (HJchatChat && !newMsg) {
            HJchatChat.hide();
        }
        layer.close(setChatMin.index);
        setChatMin.index = layer.open({
            type: 1,
            title: false,
            shade: false,
            closeBtn: false,
            anim: thatChat.anim || 2,
            offset: 'b',
            move: '#HJproject-HJchat-min',
            resize: false,
            area: ['182px', '50px'],
            content: '<img id="HJproject-HJchat-min" src="' + thatChat.avatar + '"><span>' + thatChat.name + '</span>',
            success: function(layero, index) {
                if (!newMsg) HJchatMin = layero;

                if (base.minRight) {
                    layer.style(index, {
                        left: $(window).width() - layero.outerWidth() - parseFloat(base.minRight)
                    });
                }

                layero.find('.HJproject-layer-content span').on('click', function() {
                    layer.close(index);
                    newMsg ? HJproject.each(cache.chat, function(i, item) {
                        popchat(item);
                    }) : HJchatChat.show();
                    if (newMsg) {
                        cache.chat = [];
                        chatListMore();
                    }
                });
                layero.find('.HJproject-layer-content img').on('click', function(e) {
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
        if (!HJchatChat) return;
        var index = $('.HJchat-chat-list .' + THIS).index();
        var cont = HJchatChat.find('.HJchat-chat').eq(index);
        var to = JSON.parse(decodeURIComponent(cont.find('.HJchat-chat-tool').data('json')));
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
            avatar: cache.mine ? cache.mine.avatar : (HJproject.cache.dir + 'css/pc/HJchat/skin/logo.jpg'),
            id: cache.mine ? cache.mine.id : null,
            mine: true
        };
        var thatChat = thisChat(),
            ul = thatChat.elem.find('.HJchat-chat-main ul');
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

            HJproject.each(call.sendMessage, function(index, item) {
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

            var elem = $('.HJchat-chatlist-' + data.type + data.id);
            var index = elem.index();

            data.timestamp = data.timestamp || new Date().getTime();
            if (data.fromid == cache.mine.id) {
                data.mine = true;
            }
            data.system || pushChatlog(data);
            messageNew = JSON.parse(JSON.stringify(data));

            if ((!HJchatChat && data.content) || index === -1) {
                if (cache.message[data.type + data.id]) {
                    cache.message[data.type + data.id].push(data)
                } else {
                    cache.message[data.type + data.id] = [data];

                    //记录聊天面板队列
                    if (data.type === 'friend') {
                        var friend;
                        HJproject.each(cache.friend, function(index1, item1) {
                            HJproject.each(item1.list, function(index, item) {
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

            if (!HJchatChat) return;

            //接受到的消息不在当前Tab
            var thatChat = thisChat();
            if (thatChat.data.type + thatChat.data.id !== data.type + data.id) {
                elem.addClass('HJproject-anim layer-anim-06');
                setTimeout(function() {
                    elem.removeClass('HJproject-anim layer-anim-06')
                }, 300);
            }

            var cont = HJchatChat.find('.HJchat-chat').eq(index);
            var ul = cont.find('.HJchat-chat-main ul');

            //系统消息
            if (data.system) {
                if (index !== -1) {
                    ul.append('<li class="HJchat-chat-system"><span>' + data.content + '</span></li>');
                }
            } else if (data.content.replace(/\s/g, '') !== '') {
                ul.append(laytpl(elemChatMain).render(data));
            }

            chatListMore();
        };

    //存储最近MAX_ITEM条聊天记录到本地
    var pushChatlog = function(message) {
        var local = HJproject.data('HJchat')[cache.mine.id] || {};
        local.chatlog = local.chatlog || {};
        var thisChatlog = local.chatlog[message.type + message.id];
        if (thisChatlog) {
            //避免浏览器多窗口时聊天记录重复保存
            var nosame;
            HJproject.each(thisChatlog, function(index, item) {
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
        HJproject.data('HJchat', {
            key: cache.mine.id,
            value: local
        });
    };

    //渲染本地最新聊天记录到相应面板
    var viewChatlog = function() {
        var local = HJproject.data('HJchat')[cache.mine.id] || {},
            thatChat = thisChat(),
            chatlog = local.chatlog || {},
            ul = thatChat.elem.find('.HJchat-chat-main ul');
        HJproject.each(chatlog[thatChat.data.type + thatChat.data.id], function(index, item) {
            ul.append(laytpl(elemChatMain).render(item));
        });
        chatListMore();
    };

    //查看更多记录
    var chatListMore = function() {
        var thatChat = thisChat(),
            chatMain = thatChat.elem.find('.HJchat-chat-main');
        var ul = chatMain.find('ul');
        var length = ul.find('li').length;

        if (length >= MAX_ITEM) {
            var first = ul.find('li').eq(0);
            if (!ul.prev().hasClass('HJchat-chat-system')) {
                ul.before('<div class="HJchat-chat-system"></div>');
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

    var stope = HJproject.stope; //组件事件冒泡

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
    var anim = 'HJproject-anim-upbit';
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
                prev.removeClass('HJchat-status-' + (type === 'online' ? 'hide' : 'online'))
                    .addClass('HJchat-status-' + type);
                HJproject.each(call.online, function(index, item) {
                    item && item(type);
                });
            }
        },
        //关于
        about: function() {
            layer.alert('版本： ' + v + '<br>当前版本基于HJchat魔改，当前' + v + '版权所有：<a href="http://HJchat.HJproject.com" target="_blank">HJchat.HJproject.com</a>', {
                title: '关于 LayIM',
                shade: false
            });
        },

        //弹出聊天面板
        chat: function(othis) {
            var local = HJproject.data('HJchat')[cache.mine.id] || {};
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

            HJproject.upload({
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

            HJproject.each(call['tool(' + filter + ')'], function(index, item) {
                item && item.call(othis, function(content) {
                    focusInsert(thatChat.textarea[0], content);
                }, sendMessage, thatChat);
            });
        },

    };

    //暴露接口
    exports('HJchat', new LAYIM());


}(window);
