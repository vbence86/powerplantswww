var U = window['U'] || (function(window, document, undefined){
	var hrs_container,
		hrs_start,
		hrs_step,
		hrs_offset,
		hrs_current;
	function nextPledge(){
		scrollToPledge(++hrs_current);
	}
	function previousPledge(){
		if (hrs_current > 0)
			scrollToPledge(--hrs_current);
	}
	function scrollToPledge(index){
	    $('html, body').animate({
	        scrollTop: hrs_start + (index * hrs_step)
	    }, 1000);		
	}
	function initHRS(){
		hrs_container = $('#pledges');
		hrs_start = hrs_container.offset().top;
		hrs_step = 1000;
		hrs_current = 0;
		console.log(hrs_start, hrs_step);
	}
	function initSkrollr(){
		skrollr.init({
			constants: {
				hrsstart: hrs_start
			}
		});
	}
	function initListeners(){
		$('.hrs-next').each(function(){
			$(this).click(function(){
				nextPledge();
			});
		});
	}
	$(document).ready(function(){
		initHRS();
		initSkrollr();
		initListeners();
	});
	return {
		nextPledge: nextPledge,
		previousPledge: previousPledge
	};
})(window, window.document);
