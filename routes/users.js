var express = require('express');
var router = express.Router();
var dbSession = require('../src/dbSession.js');
var bodyParser = require('body-parser');


/* GET users listing. */
router.get('/', function(req, res, next) {
	dbSession.fetchAll('SELECT * FROM users', function(err, rows) {
		if (err) {
			console.log('error:' + err);
			err.status = 500;
			next(err);
		} else {
			res.json(rows);
			next(req, res);
		}
	});
});


router.post('/', function(req, res, next) {
	dbSession.insert('users', {
		name: req.body.name,
		type: req.body.type,
		external_id: req.body.external_id

	}, function(err, res) {
		if (err) {
			console.log ('got error: ' + err.message);
		} 
	});

	res.status = 200;
	console.log('name: ' + req.body.name);
	console.log('type: ' + req.body.type);
	console.log('eid: ' + req.body.external_id);
	console.log('poast' + req.body);
	console.log(req.body);
	res.json(req.body);
	next(req, res);
});

router.route('/:id').get(function (req, res) {
	dbSession.fetchRow('SELECT * FROM users WHERE id=?', req.params.id, function(err, row) {
		if (err) {
			console.log(err);
			err.status = 500;
		} else {
			res.json(row);
		}
	});
//	res.send(req.params.id);
}).patch(function (req, res) {
	res.status = 500;
	res.body="Not yet implemented";
}).delete(function(req, res) {

	var w = dbSession.getSelect().where('id=?', req.params.id);



	dbSession.remove('users', w, function(err) {
		if (err) {
			console.log(err);
			err.status = 500;
			res = err;
		} else {
			res.status = 200;
			res.send('OK');
		}
	});

});

module.exports = router;
