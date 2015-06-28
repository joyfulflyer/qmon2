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

		$scope.updateUser = function(keyword) {
			console.log('got presssed');
			console.log(keyword);
		};
		
		$scope.gridOptions = {
			columnDefs: [
				{headerName: "Name", field: "name"},
				{headerName: "Role", field: "type"},
				{headerName: "External ID", field: "external_id"},
				{
					headerName: '', 
					templateUrl: '/partials/userEditButtons.html', 
					enableCellEdit: false, 
					sortable: false
				}
			],
			rowData: null,
			enableCellEdit: true,
			enableSorting: true,
			enableColumnResize: true,
		};
		
	}
]);