'use strict';

/* App Module */

var qmon = angular.module('qmon', [
  'ngRoute',
  "angularGrid",
  'ngCookies',
  
  'qmonControllers',
  'qmonFilters'
]);

qmon.config(['$routeProvider', 
	function($routeProvider) {
		$routeProvider.
		when('/users', {
			templateUrl: 'partials/usersModal.html',
			controller: 'UserCtrl'
		}).otherwise({redirectTo: '/'});
	}
]);