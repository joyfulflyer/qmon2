'use strict';

var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	db.addColumn('users', 'external_id',
		{
			type: 'string'
		}, callback
	);
};

exports.down = function(db, callback) {
	async.series(
	[
		db.removeColumn.bind(db, 'users', 'external_id')
	], callback);
};
