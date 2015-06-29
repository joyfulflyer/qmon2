'use strict';

var express = require('express');
var dbSession = require('../src/dbSession.js');
var bodyParser = require('body-parser');
var http = require('http');


var zdWrapper;
//maybe I'm too java but I think I want a zdWrapper object to carry around, is that what i'm doing?
var zdWrapper.connect = function(org, user, key, callback) {
	if (user === 'undefined' || org === 'undefined' || key === 'undefined') {
		throw new Error('Need orginization, username and API key to be able to connect'); 
	}
	
	var basePath = '/api/v2';
	var hostname = 'https://' + org + '.zendesk.com';
	var auth = ':' + user + '/token:' + key; //I hope this is right
	console.log('set some variables');
	callback();
}

var zdWrapper.getQueueStatus = function(callback) {
	var options = {
		hostname: hostname,
		auth: auth,
		path: basePath + '/channels/voice/stats/current_queue_activity'
	}
	http.get(options, callback);
}

module.exports = zdWrapper;