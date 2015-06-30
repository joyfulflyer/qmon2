'use strict';

var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series([
		db.createTable.bind(db,
			'users',
			{
				id: { type: 'int', primaryKey: true, auto_increment: true },
				name: 'string',
				type: 'int',
				call_start: 'string'
			}
		)
	], callback);
};

exports.down = function(db, callback) {
	async.series([
		db.dropTable.bind(db, 'users')
	], callback);
};
