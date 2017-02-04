/**
 * drag 操作的乱七八糟版
 */

window.setdragable = function(id){
    
	var dragEle = $('#'+id);



		//有啥不一样的。。一脸懵逼
		//求告诉区别？？

		 var dict = {};
		 dragEle.isPressDown = false;
		 dragEle.on("mousedown",function(e){
			e.preventDefault();
			dict.x = e.clientX - dragEle.css('left');
			dict.y = e.clientY - dragEle.css('top');
			dragEle.isPressDown = true;
		});

		$(document).on("mousemove",function(e){
			if(dragEle.isPressDown){
				dragEle.css({
					left:e.clientX - dict.x+20,
					top:e.clientY - dict.y+20
				});
			}
		}).on("mouseup",function(e){
			if(dragEle.isPressDown)
				delete dragEle.isPressDown;
		});

}
		