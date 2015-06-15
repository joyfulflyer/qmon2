var express = require('express');
var router = express.Router();
var dbSession = require('../src/dbSession.js');
var bodyParser = require('body-parser');

/* GET users listing. */
router.get('/', function(req, res, next) {
	dbSession.fetchAll('SELECT * FROM users', function(err, rows) {
		if (err) {
			//console.log(err);
			err.status = 500;
			next(err);
		} else {
			console.log(rows);
			res.json(rows);
		}
	});
});

router.post('/' function(req, res, next) {
	console.log('poast');
});

module.exports = router;
