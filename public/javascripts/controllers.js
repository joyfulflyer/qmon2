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
				{headerName: "Name", field: "name", width: '50%'},
				{headerName: "Role", field: "type", width: "50"},
				{headerName: "External ID", field: "external_id", width: "50"},
				{
					headerName: '', 
	//				cellRenderer: saveButtonCellRenderer, 
					templateUrl: 'partials/userEditButtons.html',
					enableCellEdit: false, 
					sortable: false,
					width: "60"
				},
				{
					headerName: '',
					cellRenderer: deleteButtonCellRenderer,
					enableCellEdit: false,
					sortable: false,
					width: "60"
				}
			],
			rowData: null,
			angularCompileRows: true,
			enableCellEdit: true,
			enableSorting: true,
			enableColumnResize: true,
		};
		
		function deleteButtonCellRenderer(params) {
			params.$scope.deleteClicked = function (user) {
				console.log("deleteing!");
			}
			return '<button class="btn btn-warning btn-sm" ng-click="deleteClicked(row.entity)">Delete</button>';
		}
		
		function saveButtonCellRenderer(params) {
			console.log(params);
			params.$scope.saveClicked = function(user) {
				console.log(params);
				console.log('save clicked');
				console.log(user);
			};
			return '<button class="btn btn-primary btn-sm" ng-click="saveClicked(data)">Save</button>';
		}
		
	}
]);