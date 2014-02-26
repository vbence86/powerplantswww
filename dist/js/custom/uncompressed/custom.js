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
			hrs_current = 0;
		/** Initialization **/
		function initHRS(){
			setHRSConstants();
			setHRSPlaceholderHeight();
		}
		function setHRSConstants(){
			var i = 0;
			hrs_container = $('#pledges');
			hrs_start = hrs_container.offset().top;
			while(i < hrs_step_number){
				hrs_steps.push(hrs_start + hrs_step * i++)
			}
			hrs_step_last = hrs_steps[hrs_steps.length - 1];
		}
		function setHRSPlaceholderHeight(){
			$('#hrs-placeholder').css({height: (hrs_step * hrs_step_number - hrs_step / 3) + 'px'});
		}
		function initSkrollr(){
			skrollr.init({
				constants: (function(){
					var data = {
						hrsstart: hrs_start
					};
					i = hrs_steps.length;
					while(i--){
						data['hrs_step_' + i] = hrs_steps[i];
					}
					return data;
				})(),
				forceHeight: false
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
				updateHRSCurrent(scrollTop);
			});
		}
		/** Switch/Scroll the pledges **/
		function firstPledge(){
			scrollToPledge(hrs_current = 1);
		}	
		function nextPledge(){
			if (hrs_current < hrs_step_number)
				scrollToPledge(++hrs_current);
		}
		function previousPledge(){
			if (hrs_current > 0)
				scrollToPledge(--hrs_current);
		}
		function scrollToPledge(index){
			if (!hrs_steps[index])
				return;
		    $('html, body').animate({
		        scrollTop: hrs_steps[index]
		    }, 1000);
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
			$('#pledges').removeClass('skrollable').css({
				position: 'absolute',
				top: hrs_step_last + 'px'
			});
			hrs_ended = true;
		}
		function releaseLastPledge(){
			$('#pledges').addClass('skrollable').css({
				position: 'fixed',
				top: 0
			});					
			hrs_ended = false;
		}
		function updateHRSCurrent(scroll_top){
			hrs_current = Math.floor((scroll_top - hrs_start) / hrs_step);
		}
		return {
			init: function(){
				initHRS();
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
				var that = this,
					hrs_start = HRSController.getStartPos(),
					hrs_step_last = HRSController.getEndPos();
				hero = $('#hero');
				$(window).scroll(function(){
					var distance = $(this).scrollTop() - hrs_start,
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
					'background-position-y': -frame * hero_dimension.h + 'em'
				});
			}
		}
	})();
	return {
		init: function(){
			HRSController.init();
			HeroController.init(HRSController);
		}
	};
})(window, window.document);
$(document).ready(function(){
	Universe.init();
});