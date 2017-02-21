/**

 @HJtags v0.0.1
 @Author：绿豆
 @Site：
 @License：
    
自定义 tags 标签

整个的注释：md 为了简单，我直接使用全局变量index来区分不同HJ-tags对象,很low，以后再说，改成HJalert形式
改进版想法：
HJ-tags对象属性：index,tags,content.
 */

!function(window,undefined){
	"use strict";
	//分割符
	
	//自定义html标签元素
	
/*	var HJtagsProto = Object.create(HTMLDivElement.prototype);
	//class HJtagsElement extends HTMLDivElement{};
	HJtagsProto.index = 0;
*/
	Array.prototype.S=String.fromCharCode(2);
	Array.prototype.in_array=function(e){
		if(this.length == 0)
			return false;
		else{
			var r = new RegExp(this.S + e + this.S);
   	 		return (r.test(this.S + this.join(this.S) + this.S));
		}
    	
	};

/*	HJtagsProto.getValue = function(HJtagsEle){
		//return $(HJtagsEle).attr('value').split(',');
		return HJtagsEle.tags;
	}*/

/*	function addTag(HJtagsEle,callback){
		if(HJtagsEle.content != '' && !HJtagsEle.tags.in_array(HJtagsEle.content)){
			//追加标签
			//var addtag = '<span class="tagSpan" id="' + content + HJtagsProto.index +'><span>' + content + '</span>&nbsp;&nbsp;<a href="#" title="removeTag">x</a></span>'; 
			//$(tagsHandleId).prepend(addtag);
			//$(addtag).insertBefore($(tagsHandleId).parent());
			$('<span>').addClass('tagSpan').attr('id',HJtagsEle.content+HJtagsEle.index).append(
				$('<span>').text(HJtagsEle.content).append('&nbsp;&nbsp;'),
				$('<a>',{
					href : '#',
					title : "removeTag",
					text : 'x'
				}).click(function(){
					return $('#'+HJtagsEle.content+HJtagsEle.index).remove();
				})).insertBefore('#addTag'+HJtagsEle.index);
			//push content 入 value
			//var temp = $(HJtagsEle).attr('value');
			var addvalue = ($(HJtagsEle).attr('value')+ ',' + HJtagsEle.content);
			$(HJtagsEle).attr('value',addvalue);
			HJtagsEle.tags.push(HJtagsEle.content);
			return callback();
		}
	}

	//标签创建回调函数
	HJtagsProto.createdCallback = function(){
		var that = this;
		HJtagsProto.index ++;
		var tagList = new Array();

		that.innerHTML = '<div class="tagsHandle tagsHandle' + HJtagsProto.index + '">' 
		+(function(){
			var inHtml = '';
			//默认分割符为','号
			tagList = $(that).attr('value').split(',');
			if(tagList[0] == ''){
				tagList = new Array();
			}
			for(var i = 0;i<tagList.length;i++){
				//为每个tag创建html标签
				inHtml += '<span class="tagSpan" id="' + tagList[i] + HJtagsProto.index + '"><span>' + tagList[i] + '</span>&nbsp;&nbsp;<a href="#" title="removeTag" onclick="return $(\'#' + tagList[i] + HJtagsProto.index + '\').remove()">x</a></span>'
			}
			return inHtml;
		}()) 
		+'<div class= "tagInputDiv" id="addTag' + HJtagsProto.index + '"><input type="text" class="tagInput tagInput' + HJtagsProto.index 
		+ '" placeholder="add tag"></input></div></div>';
		//console(this.innerHTML);
		that.index = HJtagsProto.index;
		that.tags = tagList;
		that.addCallback = new Function("return " + $(that).attr('addCallback'));//eval('('+$(that).attr('addCallback')+')');

		$(that).find('a').bind('onclick',function(){
			return removeTag(this);
		});*/

/*		$(that).bind('keypress',function(event){
			if(event.keyCode == '13'){
				that.content = $(this).find('.tagInput').val();
				addTag(that,that.addCallback);
				//清空输入框
				$(this).find('.tagInput').val('');
			}
		});
	};*/




	//暴露接口。。感觉很 low
	window.HJElementCounter = 0;
	
	class HJTagsElement extends HTMLElement{

		constructor(){
			super();
			var that = this;
			HJElementCounter++;
/*			that.addEventListener('keypress',function(event){
				if(event.keyCode == '13'){
					
					that.content = $(that).find('.tagInput').val();

					addTag(that,that.addCallback);
					//$(this).find('.tagInput').val('');
					//
					$(that).find('.tagInput').val('');
				}
			});*/
		}

		connectedCallback(){
			var that = this;
			that.index = HJElementCounter;
			that.innerHTML = '<div class="tagsHandle tagsHandle' + HJElementCounter + '">' 
			+(function(){
				var inHtml = '';
				//默认分割符为','号
				//var tagList = this.attr('value').split(',');
				var tagStr = $(that).attr('value');
				var tagList = typeof tagStr === 'undefined' ? new Array() : tagStr.split(',');

				if(tagList[0] == ''){
					tagList = new Array();
				}
				that.tags = tagList;
				that.addCallback = new Function("return " + $(that).attr('addCallback'));//eval('('+$(that).attr('addCallback')+')');
				for(var i = 0;i<tagList.length;i++){
					//为每个tag创建html标签
					inHtml += '<span class="tagSpan" id="' + tagList[i] + HJElementCounter + '"><span>' + tagList[i] 
					+ '</span>&nbsp;&nbsp;<a href="#" title="removeTag" onclick="return $(\'#' + tagList[i] + HJElementCounter + '\').remove()">x</a></span>'
				}
				return inHtml;
			}()) 
			+'<div class= "tagInputDiv" id="addTag' + HJElementCounter + '"><input type="text" class="tagInput tagInput' + HJElementCounter
			+ '" placeholder="add tag"></input></div></div>';

			//console.log("在这停顿");
			$(that).bind('keypress',function(event){
				if(event.keyCode == '13'){
					that.content = $(this).find('.tagInput').val();
					this.addTag(that,that.addCallback);
					//清空输入框
					$(this).find('.tagInput').val('');
				}
			});

		}

		addTag(HJtagsEle,callback){
			if(HJtagsEle.content != '' && (!HJtagsEle.tags.in_array(HJtagsEle.content))){
				//追加标签
				//var addtag = '<span class="tagSpan" id="' + content + HJtagsProto.index +'><span>' + content + '</span>&nbsp;&nbsp;<a href="#" title="removeTag">x</a></span>'; 
				//$(tagsHandleId).prepend(addtag);
				//$(addtag).insertBefore($(tagsHandleId).parent());
				$('<span>').addClass('tagSpan').attr('id',HJtagsEle.content+HJtagsEle.index).append(
					$('<span>').text(HJtagsEle.content).append('&nbsp;&nbsp;'),
					$('<a>',{
						href : '#',
						title : "removeTag",
						text : 'x'
					}).click(function(){
						return $('#'+HJtagsEle.content+HJtagsEle.index).remove();
					})).insertBefore('#addTag'+HJtagsEle.index);
				//push content 入 value
				//var temp = $(HJtagsEle).attr('value');
				var addvalue = ($(HJtagsEle).attr('value')+ ',' + HJtagsEle.content);
				$(HJtagsEle).attr('value',addvalue);
				HJtagsEle.tags.push(HJtagsEle.content);
				return callback();
			}
		}

	}
	customElements.define('hj-tags',HJTagsElement);
	/*window.HJtagsElement = document.registerElement('HJ-tags',{
		prototype : HJtagsProto
	});*/
}(window);