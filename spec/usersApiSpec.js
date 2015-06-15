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
	

	
	beforeEach(function(done) {
		app.set('port', port);
		server = http.createServer(app);
		server.listen(port, function (err) {
			console.log('started listening on port: ' + port);
			resetDatabase(dbSession, done);
			done(err);
		});
	});
	
	afterEach(function(done) {
		server.close(function() {
			console.log('closing server');
			resetDatabase(dbSession, done);
			done();
		});
	});
	
	it('should respond to GET at /users/', function(done) {
		
		var expected = [
		{'id': 1, 'name': 'Bob', 'type': 1, 'call_start': null},
		{'id': 2, 'name': 'Sally', 'type': 2, 'call_start': '20'},
		{'id': 3, 'name': 'Lee', 'type': 2, 'call_start': null}
		];
		
		
		async.series( 
			[
				function(callback) {
					debugger;
					console.log('doing first insert');
					dbSession.insert(
						'users',
						{'name': 'Bob', 'type': 1},
						function(err) {
							console.log ('error: '+ err)
							
							callback(err)}
					);
					console.log('\n\n' + dbSession);
				},
				
				function(callback) {
					console.log('second insert');
					dbSession.insert(
						'users',
						{'name': 'Sally', 'type': 2, 'call_start': '20'},
						function(err) { callback(err) }
					);
					console.log('did second insert');
				},
				
				function(callback) {
					console.log('third insert');
					dbSession.insert(
						'users',
						{'name': 'Lee', 'type': 2},
						function(err) {callback(err) }
					);
				}
			], function(err, results) {
				
				request.get(
					{
						'url': 'http://localhost:8081/users/',
						'json': true
					},
					function (err, response, body) {
						console.log(err);
						console.log(response);
						console.log(body);
						expect(response.statusCode).toBe(200);
						expect(body).toEqual(expected);
						done();
					}
				);
				
			}
		);
		
		
		
		
	});	
});