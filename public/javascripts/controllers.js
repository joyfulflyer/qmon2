'use strict';

var qmonControllers = angular.module('qmonControllers', ['angularGrid']);

qmonControllers.controller('UserCtrl', ['$scope', '$http',
	function ($scope, $http) {

		$http.get('users/').success(function(data) {
			console.log(data);
			$scope.users = data;
			$scope.gridOptions.rowData = data;
			if ($scope.gridOptions.api) {
				$scope.gridOptions.api.onNewRows();
			}
		});

		$scope.updateUser = function(user) {
			console.log('got presssed');
			console.log(user);
			$http.post('/users', user).
				success(function (data, status, headers, config) {
					console.log(data);
				});
		};
		
		$scope.gridOptions = {
			columnDefs: [
				{headerName: "Name", field: "name", editable: true, width: 50},
				{headerName: "Role", field: "type", width: 50},
				{headerName: "External ID", field: "external_id", width: 100},
				{
					headerName: '', 
					templateUrl: 'partials/userEditButtons.html',
					enableCellEdit: false, 
					sortable: false,
					width: 112
				}
			],
			rowData: null,
			angularCompileRows: true,
			enableCellEdit: true,
			enableSorting: true,
			enableColResize: true,
			enableCellSelection: false
		};
		
	}
]);

qmonControllers.controller('QueueCtrl', ['$scope', '$http',
	function ($scope, $http) {
		var poll = function() {
			$http.get('queue/').success(function(data) {
				console.log('queue information');
				console.log(data.current_queue_activity);
				$scope.callers = data.current_queue_activity.calls_waiting;
				$scope.waitTime = data.current_queue_activity.longest_wait_time;
			}).error(function(data, status) {
				console.log('got error: ' + status);
				clearInterval(queuePoll); // stop polling as soon as there is a problem
			});
		};
		poll();
		var queuePoll = setInterval(poll, 5000);
	}
]);