'use strict';

var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
	async.series(
		[
			db.createTable.bind(db,
				'types',
				{
					id: { type: 'int', primaryKey: true },
					name: 'string'
				}
			)
		], callback);
};

exports.down = function(db, callback) {
  async.series([
	db.dropTable.bind(db, 'types')
  ], callback);
};
