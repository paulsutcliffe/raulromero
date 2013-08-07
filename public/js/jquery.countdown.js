/**
 * @name		jQuery Countdown Plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/12/countdown-jquery/
 * @license		MIT License
 */
 //
 //Important : This a Customzied and a bit smaller version of this plugin to run smoother in this case
 //
(function($){
	var d1 =$("#d1");
	var d2 =$("#d2");
	var d3 =$("#d3");
	var h1 =$("#h1");
	var h2 =$("#h2");
	var m1 =$("#m1");
	var m2 =$("#m2");
	var s1 =$("#s1");
	var s2 =$("#s2");

	// Creating the plugin
	$.fn.countdown = function(prop){
		var options = $.extend({
			callback	: function(){},
			timestamp	: 0
		},prop);
		if((new Date()) > options.timestamp){
			// Notice the *1000 at the end - time must be in milliseconds
			options.timestamp = (new Date()).getTime() + 864000000;
		}
		var left, d, h, m, s;
		(function tick(){
			// Time left
			left = Math.floor((options.timestamp - (new Date())) / 1000);
			if(left < 0){
				left = 0;
			}
			// Number of days left
			d = Math.floor(left / 86400);
			switchDigit(d1,Math.floor(d/100));
			switchDigit(d2,Math.floor(d/10)%10);
			switchDigit(d3,d%10);
			left -= d*86400;
			// Number of hours left
			h = Math.floor(left / 3600);
			switchDigit(h1,Math.floor(h/10)%10);
			switchDigit(h2,h%10);
			left -= h*3600;
			// Number of minutes left
			m = Math.floor(left / 60);
			switchDigit(m1,Math.floor(m/10)%10);
			switchDigit(m2,m%10);
			left -= m*60;
			// Number of seconds left
			s = left;
			switchDigit(s1,Math.floor(s/10)%10);
			switchDigit(s2,s%10);
			// Calling an optional user supplied callback
			options.callback(d, h, m, s);
			// Scheduling another call of this function in 1s
			setTimeout(tick, 1000);
		})();
		return this;
	};
	// Creates an animated transition between the two numbers
	function switchDigit(position,number){
		var digit = position.find('span.digit');
		if(digit.is(':animated')){
			return false;
		}
		if(position.data('digit') == number){
			// We are already showing this number
			return false;
		}
		position.data('digit', number);
		digit.html(number);
	}
})(jQuery);