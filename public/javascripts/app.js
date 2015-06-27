'use strict';

/* App Module */

var qmon = angular.module('qmon', [
  'ngRoute',
  'qmonControllers'
]);

qmon.config(['$routeProvider', 
	function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/'});
	}
]);