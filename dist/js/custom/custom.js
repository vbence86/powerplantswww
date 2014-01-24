(function(window, document, undefined){
	$(document).ready(function(){
		$(window).scroll(function(){
			currentoffset = $(this).scrollTop();
			if (currentoffset<601) {
				/* EXTRA CLOUDS */
				thisoffset = currentoffset - 50*(currentoffset/600);
				scaleclouds = (currentoffset/4000)+1;
				$("#extraclouds").css({top:thisoffset,transform:"scale("+scaleclouds+")"});
				/* BOOM TEXT */
				thisoffset = currentoffset - 100*(currentoffset/500);
				$("#boom").css({top:thisoffset});
				/* BITS 1 */
				thisoffset = currentoffset - 100*(currentoffset/300);
				thisrotation = 25*((currentoffset/500));
				$("#bits1").css({top:thisoffset,transform:"rotate("+thisrotation+"deg)"});
				/* BITS 2 */
				thisoffset = currentoffset - 100*(currentoffset/700);
				$("#bits2").css({top:thisoffset});
				/* BITS 3 */
				thisoffset = currentoffset - 100*(currentoffset/700);
				scalebit3 = (currentoffset/500)+1;
				$("#bits3").css({top:thisoffset,transform:"scale("+scalebit3+")"});
			}
		});
	});
})(window, window.document);
