var express = require('express');
var router = express.Router();
var zdWrapper = require('../src/zdWrapper');
var bodyParser = require('body-parser');
var callQueue = require('../models/callQueue');


/* GET queue info. */
router.get('/', function(req, res, next) {
	var content = zdWrapper.queueStatus;
	content.vm = zdWrapper.voicemails;
	content.email = zdWrapper.emails;
	res.json(content);
	next(req, res);
});

router.get('/time', function(req, res, next) {
	res.json(zdWrapper.lastQueueCall);
	next(req, res);
});

router.get('/vm', function(req, res, next) {
	res.json(zdWrapper.voicemails);
	next(req, res);
});

router.get('/email', function(req, res, next) {
	res.json(zdWrapper.emails);
	next(req, res);
});


router.post('/', function(req, res, next) {
	console.log('poast' + req.body);
	console.log(req.body);
	res.json(req.body);
	next(req, res);
});



module.exports = router;
