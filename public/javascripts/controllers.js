'use strict';

var qmonControllers = angular.module('qmonControllers', ['angularGrid']);

qmonControllers.controller('UserCtrl', ['$scope', '$http',
	function ($scope, $http) {

		var getLatestUserData = function() {
			$http.get('users/').success(function(data) {
				console.log('getting user data');
				$scope.users = data;  //An array of ojects I believe
				$scope.gridOptions.rowData = data;
				if ($scope.gridOptions.api) {
					$scope.gridOptions.api.onNewRows();
				}
				separateUserTypes();
			}).error(function(err) {
				console.log('error! ' + err);
			});
		};

		$scope.supportUsers = [];
		$scope.actUsers = [];

		var separateUserTypes = function() {
			for(var i = 0; i < $scope.users.length; i++) {
				var currentUser = $scope.users[i];
				if (currentUser.type == 1) {
					$scope.supportUsers.push(currentUser);
				} else {
					$scope.actUsers.push(currentUser);
				}

			}
		}

		getLatestUserData();

		

		$scope.updateUser = function(user) {
			console.log('Not implemented!');
		};

		$scope.deleteUser = function(user) {
			console.log('Deleting user!!!');
			console.log(user);
			var options = {

			};

			$http.delete('/users/' + user.id).success(function(data, status, headers, config) {
				console.log('deleted user!');
				getLatestUserData();
			}).error(function(error) {
				console.log('got error' + error);
			});
		}

		$scope.addUser = function(name, type, external_id) {
			var u = {
				name: name,
				type: type || 1,
				external_id: external_id
			};
			console.log('adding user');
		//	console.log(user);
			$http.post('/users', u).success(function (data, status, headers, config) {
				console.log(data);
				getLatestUserData();
			}).error(function() {
				console.log ('got error when posting');
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
			enableCellEdit: false,
			enableSorting: true,
			enableColResize: true,
			enableCellSelection: false
		};


		var getUsersOfType = function (type) {

		}
		
	}
]);

qmonControllers.controller('QueueCtrl', ['$scope', '$http',
	function ($scope, $http) {
		var poll = function() {
			$http.get('queue/').success(function(data) {
				console.log('queue information');
				console.log(data.current_queue_activity);
				if (data.current_queue_activity != null){
					$scope.lastAccessed = new Date();
					$scope.callers = data.current_queue_activity.calls_waiting;
					$scope.waitTime = data.current_queue_activity.longest_wait_time;
					$scope.averageTime = data.current_queue_activity.average_wait_time;
				}
			}).error(function(data, status) {
				console.log('got error: ' + status);
				clearInterval(queuePoll); // stop polling as soon as there is a problem
			});
		};
		poll();
		var queuePoll = setInterval(poll, 1000);
	}




]);