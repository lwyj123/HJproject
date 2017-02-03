/**
 * drag 操作的乱七八糟版
 */

window.setdragable = function(id){

	var dragEle = $('#'+id)[0];


		dragEle.onmousedown = function(e){
			var oevent = e || event;
			var dx = oevent.clientX - dragEle.offsetLeft;
			var dy = oevent.clientY - dragEle.offsetTop;

			document.onmousemove = function(e){
				var oevent = e || event;
				dragEle.style.left = oevent.clientX - dx + 'px';
				dragEle.style.top = oevent.clientY - dy + 'px';
			};

			document.onmouseup = function(e){
				document.onmousemove = null;
				document.onmouseup = null;
			};
		};/**/

		//有啥不一样的。。一脸懵逼
		//求告诉区别？？
		/*
		 var dic = {};
		 dragEle.isPressDown = false;
		 dragEle.on("onmousedown",function(e){
			e.preventDefault();
			dict.x = e.clientX - dragEle.css('left');
			dict.y = e.clientY - dragEle.css('top');
			dragEle.isPressDown = true;
		});

		$(document).on("onmousemove",function(e){
			if(isPressDown){
				dragEle.css({
					x:e.clientX - dict.x,
					y:e.clientY - dict.y
				});
			}
		}).on("onmouseup",function(e){
			if(dragEle.isPressDown)
				delete dragEle.isPressDown;
		});*/

}
		