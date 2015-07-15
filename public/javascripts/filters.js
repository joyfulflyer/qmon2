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
		console.log('input: ' + input);
		console.log('time now: ' + timeNow.getTime());
		var msOnCall = timeNow - Date.parse(input);
		
		var sec = Math.floor(msOnCall/1000);
		var min = Math.floor(sec/60);
		var secAfterMin = Math.floor(sec%60);
		
		if (min > 0) {
			return min + ':' + secAfterMin;
		} else {
			return '00:' + sec;
		}
		
	//	return msOnCall/1000;
	}
})