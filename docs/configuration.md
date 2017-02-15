#HJalert Configuration
HJalertjs 是我们根据layer插件的弹出层进行二次开发的自定义的弹出层插件。该插件主要用于对各种弹出层的高效简洁创建、更改、删除等操作。用户可以通过更改参数从而相应的更改弹层样式和模板。
##HJalert 默认全局配置信息
以下配置信息适用于所有弹层类型，如果用户不对参数进行修改则默认使用以下配置信息
Name|Type|Default|Description
-|-|-|-
type|String|'page'|用于确定弹出层类型
title|String or Object|''|弹层标题
area|String or Object|'auto'|用于确定弹层大小
maxWidth|Number|360|用于规定弹层最大宽度
resize|Boolean|true|用于确定弹层是否可更改大小
