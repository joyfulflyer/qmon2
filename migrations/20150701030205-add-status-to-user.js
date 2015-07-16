'use strict';

var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	db.addColumn('users', 'status',
		{
			type: 'string'
		}, callback
	);
};

exports.down = function(db, callback) {
	async.series(
	[
		db.removeColumn.bind(db, 'users', 'status')
	], callback);
};
