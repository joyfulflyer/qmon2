'use strict';

var request = require('request');
var dbSession = require('../src/dbSession.js');
var resetDatabase = require('./resetDatabase.js');
var app = require('../app.js');
var async = require('async');
var http = require('http');

describe("The users API", function () {
	var server;
	var port = 8081;
	
	var expected = {
		"_users": [
			{'id': 1, 'name': 'Bob', 'type': 1},
			{'id': 2, 'name': 'Sally', 'type': 2, 'call_start': '20'},
			{'id': 3, 'name': 'Lee', 'type': 2}
		]
	}
	
	beforeEach(function(done) {
		app.set('port', port);
		server = http.createServer(app);
		server.listen(port, function (err) {
			console.log('started listening on port: ' + port);
			console.log('reset database?');
			done(err);
		});
	});
	
	afterEach(function(done) {
		server.close(function() {
			console.log('closing server');
			done();
		});
	});
	
	it('should respond to GET at /', function(done) {
		
		async.series( 
			[
				function(callback) {
					dbSession.insert(
						'users',
						{'name': 'Bob', 'type': 1},
						function(err) {callback(err)}
					);
				},
				
				function(callback) {
					dbSession.insert(
						'users',
						{'name': 'Sally', 'type': 2, 'call_start': '20'},
						function(err) { callback(err) }
					);
				},
				
				function(callback) {
					dbSession.insert(
						'users',
						{'name': 'Lee', 'type': 2},
						function(err) {callback(err) }
					);
				}
			]
		)
		
		
		
		request.get(
			{
				'url': 'http://localhost:8081/',
				'json': true
			},
			function (err, response, body) {
				console.log(err);
				console.log(response);
				console.log(body);
				expect(response.statusCode).toBe(200);
				done();
			});
	});	
});