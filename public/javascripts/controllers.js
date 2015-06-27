'use strict';

var qmonControllers = angular.module('qmonControllers', []);

qmonControllers.controller('UserCtrl', ['$scope', '$http',
	function ($scope, $http) {
		$http.get('users/').success(function(data) {
			console.log(data);
			$scope.users = data;
		});
	
}]);