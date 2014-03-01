var Universe = window['Universe'] || (function(window, document, undefined){
	/** HRS Controller **/
	var HRSController = (function(){
		var hrs_container,
			hrs_start,
			hrs_step = 1280,
			hrs_steps = [],
			hrs_step_last,
			hrs_step_number = 9,
			hrs_offset,
			hrs_ended = false,
			hrs_current = 0,
			hrs_scrolling = false;
		/** Initialization **/
		function setHRSContainer(){
			hrs_container = $('#pledges');			
		}
		function setupHRS(){
			adjustHRSContainerToScreen();
			setHRSConstants();
			setHRSPlaceholderHeight();
		}
		function scrollToTop(){
			window.scrollTo(0, 1);
		}
		function adjustHRSContainerToScreen(){
			var height = window.innerHeight;
			hrs_container.height(height);
			hrs_container.css({
				'font-size': (height / 600 * 10) + 'px' 
			});
		}		
		function setHRSConstants(){
			var i = 0;
			hrs_step = hrs_container.height() * 2;
			hrs_start = hrs_container.offset().top;
			hrs_steps = [];
			while(i < hrs_step_number){
				hrs_steps.push(hrs_start + hrs_step * i++)
			}
			hrs_step_last = hrs_steps[hrs_steps.length - 1];
		}
		function setHRSPlaceholderHeight(){
			$('#hrs-placeholder').css({
				height: (hrs_step * hrs_step_number - window.innerHeight) + 'px'
			});
		}		
		function initSkrollr(){
			skrollr.init({
				constants: (function(){
					var data = {
						hrsstart: function(){ return hrs_start; }
					};
					i = hrs_steps.length;
					while (i--){
						(function(index){
							data['hrs_step_' + index] = function(){ 
								return hrs_steps[index]; 
							}
						})(i);
					}
					return data;
				})(),
				forceHeight: false,
	            mobileCheck: function() {
	                return false;
	            }
			});
		}		
		function initListeners(){
			$('.hrs-next').each(function(){
				$(this).click(function(){
					firstPledge();
				});
			});
			$('#pledges-previous-button').click(function(){
				previousPledge();
			});
			$('#pledges-next-button').click(function(){
				nextPledge();
			});
			$(window).scroll(function(){
				var scrollTop = $(this).scrollTop();
				toggleHRSAtLastStep(scrollTop);
			});
			$(window).resize(function(){
				updateHRS();
			});
		}
		/** Switch/Scroll the pledges **/
		function firstPledge(){
			scrollToPledge(hrs_current = 1);
		}	
		function nextPledge(){
			if (hrs_scrolling)
				return;
			updateCurrentStep();
			if (hrs_current < hrs_step_number){
				scrollToPledge(++hrs_current);
			}
		}
		function previousPledge(){
			if (hrs_scrolling)
				return;			
			updateCurrentStep();			
			if (hrs_current > 0)
				scrollToPledge(--hrs_current);
		}
		function updateCurrentStep(){
			var scroll_top = $(window).scrollTop();
			hrs_current = Math.floor(Math.round(scroll_top - hrs_start) / hrs_step);			
		}		
		function scrollToPledge(index){
			if (!hrs_steps[index])
				return;
			hrs_scrolling = true;
		    $('html, body').animate({
		        scrollTop: hrs_steps[index]
		    }, 1000, function(){
		    	hrs_scrolling = false;
		    });
		}
		function toggleHRSAtLastStep(scroll_top){
			if (hasWeEverPassedLastPledge(scroll_top)){
				fixLastPledge();
			} else if (hasWeReturnedBeyondLastPledge(scroll_top)){
				releaseLastPledge();
			}
		}
		function hasWeEverPassedLastPledge(scroll_top){
			return !hrs_ended && isLastPledgePassed(scroll_top);
		}
		function isLastPledgePassed(scroll_top){
			return scroll_top > hrs_step_last;
		}
		function hasWeReturnedBeyondLastPledge(scroll_top){
			return hrs_ended && !isLastPledgePassed(scroll_top);
		}
		function fixLastPledge(){
			hrs_container.removeClass('skrollable').css({
				position: 'absolute',
				top: hrs_step_last + 'px'
			});
			hrs_ended = true;
		}
		function releaseLastPledge(){
			hrs_container.addClass('skrollable').css({
				position: 'fixed',
				top: 0
			});					
			hrs_ended = false;
		}
		function updateHRS(){
			scrollToTop();
			setTimeout(function(){
				setupHRS();
				skrollr.get().refresh();
			}, 500);			
		}
		return {
			init: function(){
				setHRSContainer();
				setupHRS();
				initSkrollr();
				initListeners();
			},
			getStartPos: function(){
				return hrs_start;
			},
			getEndPos: function(){
				return hrs_step_last;
			},
			nextPledge: nextPledge,
			previousPledge: previousPledge
		};
	})();
	/** Hero Controller **/
	var HeroController = (function(){
		var hero,
			hero_frames = 4;
			hero_dimension = {
				w: 12.8,
				h: 10
			};
		return {
			init: function(HRSController){
				var that = this;
				hero = $('#hero');
				$(window).scroll(function(){
					var scrollTop = $(this).scrollTop(),
						hrs_start = HRSController.getStartPos(),
						hrs_step_last = hrs_step_last = HRSController.getEndPos(),
						distance = scrollTop - hrs_start,
						frame = Math.round(distance / 75);
					if (distance + hrs_start > hrs_step_last)
						return;
					that.animate(frame % hero_frames);
				});
			},
			animate: function(frame){
				if (!hero)
					return;
				hero.css({
					'background-position': ['0em', -frame * hero_dimension.h + 'em'].join(' ')
				});
			}
		}
	})();
	return {
		init: function(){
			HRSController.init();
			HeroController.init(HRSController);
		},
		getSkrollr: function(){
			return skrollr.get();
		}
	};
})(window, window.document);
$(document).ready(function(){
	Universe.init();
});