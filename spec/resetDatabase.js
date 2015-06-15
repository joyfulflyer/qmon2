'use strict';

var async = require('async');
var env = require('../src/env');
var dbOptions = require('../database.json')[env];

var resetDatabase = function (dbSession, callback) {
	if (dbOptions.driver === 'sqlite3') {
	
		async.series(
			[
				function(callback) {
					console.log('removing users');
					dbSession.remove('users', '1', function (err) {
						callback(err)
					});
					console.log("removed keyword");
				//	console.log(dbSession);
				},
				function (callback) {
					dbSession.remove('sqlite_sequence', '1', function(err) {
						callback(err)
					});
				}
			],
			
			function (err, results) {
				callback(err);
			}
		);


	
	}
	
	if (dbOptions.driver === 'mysql') {
		async.series(
			[
				function(callback) {
					dbSession.remove('TRUNCATE keyword', [], function(err) {
						callback(err)
					});
				},
				
				function(callback) {
					dbSession.remove('TRUNCATE category', [], function(err) {
						callback(err)
					});
				}
			],
			function (err, results) {
				callback(err);
			}
		);
	}
	
	
};

module.exports = resetDatabase;