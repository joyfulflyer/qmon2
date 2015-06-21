'use strict';

/* App Module */

var qmon = angular.module('qmon', [
  'ngRoute',
]);

qmon.config(['$routeProvider', 
	function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/'});
	}
]);