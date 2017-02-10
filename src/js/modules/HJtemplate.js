/**

 @Name：HJtemplate v0.0.2 js模板引擎  
 @Author：梁王
 @Site：None
 @License：MIT
 当前初版是基于layui(贤心), 看得头大，结果就只是改了代码结构而已，基本实现还是laytpl的。
 */

/**
 * For code learner
 * 作者使用new Function()这种方式来实现让看代码时的我感到非常的亮眼，原来还可以这样。
 */


/**
 *  
模版语法
输出一个普通字段，不转义html：   {{ d.field }}
输出一个普通字段，并转义html：   {{= d.field }}
逻辑处理： {{#  JavaScript 表达式 }} 
(
  注意:只能是表达式，不能为 {{#  fn() }} 的这样的写法，只能为：{{ fn() }} 
  正确的写法是： 
  {{#  if(true){ }}
    内容：{{ fn() }}
  {{#  } }}
)
 */

;
! function(window, undefined) {
    "use strict";

    var HJtemplate = new Function();

    HJtemplate.version = '0.0.2';
    HJtemplate.moduleName = 'HJtemplate';





    var config = {
        open: '{{',
        close: '}}'
    };

    var tool = {
        //封装全局匹配正则对象
        exp: function(str) {
            return new RegExp(str, 'g');
        },
        //匹配满足规则内容,type为0是js语句，type为1是普通字段
        query: function(type, prefix, postfix) {
            var typeArr = [
                '#([\\s\\S])+?', //js语句
                '([^{#}])*?' //普通字段
            ];
            var types = typeArr[type || 0];
            return exp((prefix || '') + config.open + types + config.close + (postfix || ''));
        },
        //
        escape: function(html) {
            return String(html || '').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
                .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        },
        //报错模块
        error: function(e, tplog) {
            var error = 'Laytpl Error：';
            typeof console === 'object' && console.error(error + e + '\n' + (tplog || ''));
            return error + e;
        }        
    }

    var exp = tool.exp;
    var Tpl = function(tpl) {
            this.tpl = tpl;
        };

    Tpl.pt = Tpl.prototype;

    window.errors = 0;

    //编译模版
    Tpl.pt.parse = function(tpl, data) {
        var that = this,
            tplog = tpl;
        var jss = exp('^' + config.open + '#', ''),
            jsse = exp(config.close + '$', '');

        //先替换掉空白字符和换行之类的，
        tpl = tpl.replace(/\s+|\r|\t|\n/g, ' ')

        //避免#和后面的语句连在一起
        .replace(exp(config.open + '#'), config.open + '# ')
        //???
        .replace(exp(config.close + '}'), '} ' + config.close)
        //???
        .replace(/\\/g, '\\\\')
        //???
        .replace(/(?="|')/g, '\\')
        //把模板{{# }}删了并 ????????
        .replace(tool.query(), function(str) {
            str = str.replace(jss, '').replace(jsse, '');
            return '";' + str.replace(/\\/g, '') + ';view+="';
        })
        //
        .replace(tool.query(1), function(str) {
            var start = '"+(';
            //如果是{{}}这种空的直接替换成空
            if (str.replace(/\s/g, '') === config.open + config.close) {
                return '';
            }
            //{{或}}换成空
            str = str.replace(exp(config.open + '|' + config.close), '');
            //如果是这种{{= d.field }},当然大括号已经没有了，就???
            if (/^=/.test(str)) {
                str = str.replace(/^=/, '');
                start = '"+_escape_(';
            }
            return start + str.replace(/\\/g, '') + ')+"';
        });

        //此时tpl是包含(d.title)这样的js代码
        tpl = '"use strict";var view = "' + tpl + '";return view;';

        try {
            //惊了，竟然还能这样用
            that.cache = tpl = new Function('d', '_escape_', tpl);
            return tpl(data, tool.escape);
        } catch (e) {
            delete that.cache;
            return tool.error(e, tplog);
        }
    };

    Tpl.pt.render = function(data, callback) {
        var that = this,
            tpl;
        if (!data) return tool.error('no data');
        tpl = that.cache ? that.cache(data, tool.escape) : that.parse(that.tpl, data);
        if (!callback) return tpl;
        callback(tpl);
    };

    HJtemplate.template = function(tpl) {
        if (typeof tpl !== 'string') return tool.error('Template not found');
        return new Tpl(tpl);
    };

    HJtemplate.config = function(options) {
        options = options || {};
        for (var i in options) {
            config[i] = options[i];
        }
    };
  

    window.HJtemplate = HJtemplate;


}(window);
