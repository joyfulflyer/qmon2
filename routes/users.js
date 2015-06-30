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
			console.log(rows);
			res.json(rows);
			next(req, res);
		}
	});
});


router.post('/', function(req, res, next) {
	//dbSession.insert('users')
	
	console.log('poast' + req.body);
	console.log(req.body);
	res.json(req.body);
	next(req, res);
});

router.route('/:id').get(function (req, res) {
	res.send(req.params.id);
})

module.exports = router;
