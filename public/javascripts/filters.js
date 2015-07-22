'use strict';

var qmonFilters = angular.module('qmonFilters', []);

qmonFilters.filter('available', function() {
	return function(input) {
		console.log(input.status);
		if (input.status == 'available') {
			return input.name + ' ' + input.status;
		}
	};
});

qmonFilters.filter('on_call', function() {
	return function(input) {
		console.log('on call');
		console.log(input);
		if (input.status == 'on_call' || input.status == 'Available') {
			// can I maninpulate scope in here? should I?
			// what can/should I return?
			var timeNow = new Date();
	//		console.log(input.call_start);
			var temp = Date.parse(input.call_start);
			console.log(temp);
			console.log(timeNow - Date.parse(input.call_start));
			var timeOnCall = timeNow - Date.parse(input.call_start);
	//		console.log(input);
			console.log(timeOnCall);
			return input.name + ' | ' + input.status;
		}
	};
});

qmonFilters.filter('timeSinceCall', function() {
	return function(input) {
		var timeNow = new Date();
		var msOnCall = timeNow - Date.parse(input);

		var sec = Math.floor(msOnCall/1000);
		if (sec < 10) {
			return '00:0'+ sec;
		}
		var min = Math.floor(sec/60);
		var secAfterMin = Math.floor(sec%60);
		if (secAfterMin < 10) {
			secAfterMin = '0' + secAfterMin; // I can't believe I can do this
		}
		if (min > 0) {
			return min + ':' + secAfterMin;
		} else {
			return '00:' + sec;
		}
	}
});

qmonFilters.filter('formatWaitTime', function() {
	return function(input) {
		if (input < 60) {
			return input;
		}
		var min = Math.floor(input/60);
		var sec = Math.floor(input%60);
		if (sec < 10) {
			sec = '0' + sec;
		}
		return min + ':' + sec;
	};
});
