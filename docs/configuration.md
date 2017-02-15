# HJalert Configuration


HJalertjs 是我们根据layer插件的弹出层进行二次开发的自定义的弹出层插件。该插件主要用于对各种弹出层的高效简洁创建、更改、删除等操作。用户可以通过更改参数从而相应的更改弹层样式和模板。
##1.HJalert 默认全局配置信息
以下配置信息适用于所有弹层类型，如果用户不对参数进行修改则默认使用以下配置信息
<<<<<<< HEAD


Name | Type | Default | Description
--- | --- | --- |----
type | String | 'page' | 用于确定弹出层类型
title | String or Object | '' | 弹层标题



Name | Type | Description
--- | --- | ----
datasets | Array[object] | Contains data for each dataset. See the documentation for each chart type to determine the valid options that can be attached to the dataset
labels | Array[string] | Optional parameter that is used with the [category axis](#scales-category-scale).
xLabels | Array[string] | Optional parameter that is used with the category axis and is used if the axis is horizontal
yLabels | Array[string] | Optional parameter that is used with the category axis and is used if the axis is vertical

=======
Name|Type|Default|Description
:-:|:-:|:-:|:-
type|String|'page'|用于确定弹出层类型
title|String or Object|''|弹层标题
area|String or Object|'auto'|用于确定弹层大小
maxWidth|Number|360|用于规定弹层最大宽度
resize|Boolean|true|用于确定弹层是否可更改大小
icon|Number|-1|用于确定弹层图标样式(只有提示框有此属性）
shade|Boolean|true|确定弹层遮罩
shadeClose|Boolean|true|确定弹层遮罩点击是否关闭窗口
zIndex|Number|19891014|确定弹层堆叠顺序
move|String|'.HJproject-alert-title'|确定弹层可移动部分
btn|Object|String or Object|null|弹层按钮
btnAlian|Char|'r'|弹层按钮对齐方式
success|Function|null|弹层调用成功回调函数
moveEnd|Function|null|弹层移动后回调函数
>>>>>>> parent of 1469dbf... modify docs


##2.各HJalert弹层类型默认配置
###2.1.默认弹层配置
默认弹层其默认配置为全局默认配置。
**使用方式**
使用方式为`HJalert.open({config})`;下面例子
**Example Usage**
```javascript
    HJalert.open({
        type: 'page',
        title: '我是标题',
        closeBtn: true,
        area: '400px',
        shade: 0.3,
        id: 'LAY_layuipro' ,
        btn: ['火速围观', '残忍拒绝', 'fuck'],
        moveType: 1 
        content:'layer虽然已被Layui收编为内置的弹层模块,仍然            会作为一个独立组件全力维护、升级。',
        success: function(alertObj) {
            var btn = alertObj.find('.HJproject-alert-btn');
            btn.css('text-align', 'center');
            btn.find('.HJproject-alert-btn0').attr({
                href: 'http://www.layui.com/',
                target: '_blank'
            });
        },
        moveEnd: function() {
            //alert('move End');
        }
    });
```
###2.2.提示弹层
  提示框主要用于错误，提示和警告。其默认配置参数如下：
  Name|Type|Default|Description
  :-:|:-:|:-:|:-
  type|String|'dialog'|确定弹层为对话框
  title|String or Object|'Tips'|提示框标题
  maxWidth|Number|210|提示框最大宽度
  shade|Boolean|false|没有遮罩
  resize|Boolean|false|提示框不可更改大小
  icon|Number|0|提示框默认图标
  btn|Array[1]|['确定']|提示框确定按钮
  btnAlian|Char|'c'|提示框按钮居中
  **使用方式**
  直接使用`HJalert.tips(content,followObj,Options)`，其中参数说明如下：
parameterName|type|isOptional|Description
  :-:|:-:|:-:|:-
  content|String or Object|false|弹层内容，必须
  followObj|Object|false|提示框跟随对象
  Options|Object|true|用户自定义弹层参数配置
  **Example Usage**
```javascript
    HJalert.tips('我们此后的征途是星辰大海 ^_^',$('LAY_layuipro'),{icon:2});
```
  
###2.3.消息弹层
消息框主要用于弹出话消息，其默认配置参数如下：
  Name|Type|Default|Description
  :-:|:-:|:-:|:-
  type|String|'dialog'|确定弹层为对话框
  title|String or Object|'message'|消息框标题
  maxWidth|Number|210|消息框最大宽度
  shade|Boolean|false|消息框没有遮罩
  resize|Boolean|false|消息框不可更改大小
  btn|Array[1]|['确定']|消息框确定按钮
  btnAlian|Char|'c'|消息框按钮居中
  **使用方式**
  直接使用`HJalert.msg(content,options,callback)`来调用消息框。其中参数说明如下：
  parameterName|type|isOptional|Description
  :-:|:-:|:-:|:-
  content|String or Object|false|弹层内容，必须
  options|Object|true|用户自定义弹层参数配置
  callback|Function|true|弹层加载成功后回调函数
  
  **Example Usage**
```javascript
    HJalert.msg('我们此后的征途是星辰大海 ^_^',function(){
    	alert('this is msg');
    });
```




