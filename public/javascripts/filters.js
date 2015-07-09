'use strict';

var qmonFilters = angular.module('qmonFilters', []);

qmonFilters.filter('available', function() {
	return function(input) {
		console.log('available filter');
		return false;
	};
})