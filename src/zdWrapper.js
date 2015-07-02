'use strict';

var express = require('express');
var dbSession = require('../src/dbSession.js');
var bodyParser = require('body-parser');
var https = require('https');
var callQueue = require('../models/callQueue');
var async = require('async');

var zdWrapper = {};
//maybe I'm too java but I think I want a zdWrapper object to carry around, is that what i'm doing?
zdWrapper.connect = function(org, user, key, callback) {
	if (user === 'undefined' || org === 'undefined' || key === 'undefined') {
		throw new Error('Need orginization, username and API key to be able to connect'); 
	}
	
	zdWrapper.basePath = '/api/v2';
	zdWrapper.hostname = org + '.zendesk.com';
	zdWrapper.auth = user + '/token:' + key;
	zdWrapper.headers = {
		Accept: 'application/json'
	}
//	console.log('set some variables');
	console.log(zdWrapper);
	console.log(this);
	startPollingQueueStatus();
//	startPollingUserStatus();
//	var userPoll = setInterval(getUserStatus, 5000);;
	callback();
}

//Maybe this should become get queue status and have the polling start elsewhere?
var startPollingQueueStatus = function() {
	var options = {
		hostname: zdWrapper.hostname,
		auth: zdWrapper.auth,
		path: zdWrapper.basePath + '/channels/voice/stats/current_queue_activity',
		headers: zdWrapper.headers
	};
	var poll = function() {
		
		https.get(options, function (response) {
			var content = "";
			
			response.on('data', function(chunk) {
				content += chunk;
			});
			
			response.on('end', function() {
				//two methods of saving this
				zdWrapper.queueStatus = JSON.parse(content);
//				console.log(zdWrapper.queueStatus);
//				callQueue.updateQueueInfo(zdWrapper.queueStatus, new Date());
				zdWrapper.lastQueueCall = new Date(); // we store the last time we got data
			});
			
		}).on('error', function(error) {
			console.log('Error while calling queue activity: ' + error.message);
		});	
	}
	poll();
	var queuePoll = setInterval(poll, 1000); // save the variable to shut it off
}

var allContent = [];

// Current page is designed to start at 0. It uses currentPage + 1 to determine the page to view
var getUserStatus = function(currentPage) {
	if (currentPage == null) {
		currentPage = 0;
	}
	var cont = true;
	var i = 0;

	var options = {
		hostname: zdWrapper.hostname,
		auth: zdWrapper.auth,
		path: zdWrapper.basePath + '/channels/voice/stats/agents_activity.json?page=' + (currentPage + 1),
		headers: zdWrapper.headers
	};

	https.get(options, function(response) {
		var content = "";
		response.on('data', function(chunk) {
			content += chunk;
		});
		response.on('end', function() {
			console.log ('content ' + (currentPage + 1));
			content = JSON.parse(content);
//			console.log(content);
			if (content.next_page != null) {
				// add the current info to the array of agents
				allContent = allContent.concat(content.agents_activity);
//				allContent.push(content.agents_activity);
				console.log('read page ' + (currentPage + 1));
				getUserStatus(currentPage + 1);
			} else {
				processUserStatus(allContent);
				console.log('no more pages');
//				console.log(allContent);
				console.log('printed all content');
			}
		});


	});

}

/**********************************************************************
* Note on user statuses:
* status | string | Unavailable, Available, On Call, Wrap up
* status_code | string | not_available, available, on_call, wrap_up
***********************************************************************/
var processUserStatus = function(zendeskUsers) {
	console.log('started processing user status');
	var allUsers = [];
	
	dbSession.fetchAll('SELECT * FROM users', function(err, rows) {
		if (err) {
			throw new Error('error getting users from database:' + err);
		} else {
			allUsers = rows;
			console.log('got the database');
			console.log(rows);
			console.log(zendeskUsers);
			console.log('starting the for loops');
			for (var i = 0; i < zendeskUsers.length; i++) {
				for (var u = 0; u < allUsers.length; u++) {
					console.log(zendeskUsers[i].agent_id);
					console.log(allUsers[u].external_id);
					if (zendeskUsers[i].agent_id == allUsers[u].external_id) {
						console.log('Match');
						console.log(zendeskUsers[i]);
						console.log(allUsers[u]);
						console.log('end match');
						var timeNow = new Date();
						//compare to database to see what's updated (can I do this a better way?)
						if (zendeskUsers[i].status != allUsers[u].status) { //TODO: combine with above if
							console.log('updating db');
							dbSession.update('users', {
								status: zendeskUsers[i].status,
								call_start: timeNow //I don't need this for all status but I don't see a harm in recording it
							}, 'id=' + allUsers[u].id, function(err) {
								console.log('error inserting: ' +err);
							});
						}	
					}
				}
			}
		}
	});
				
}

module.exports = zdWrapper;


/******************
* Alternative method: get the availability of the users from zendesk
* https://developer.zendesk.com/rest_api/docs/voice-api/voice#getting-availability


Getting Availability

GET /api/v2/channels/voice/availabilities/{id}.json

Allowed For

Agents
Using curl

 curl https://{subdomain}.zendesk.com/api/v2/channels/voice/availabilities/{id}.json \
  -v -u {email_address}:{password} -X GET
Example Response

 Status: 200 OK

{
  "availability": {
    "via":        "client",
    "available":  true,
    "status":     "available"
  }
}
Availability JSON Format

Availability has the following keys:

Name	Type	Comment
available	boolean	The current availability status of the agent
via	string	The channel (client/phone) the agent is registered on
status	string	The status of the agent. Posible values: "available", "on_call", "wrap_up", "not_available"

*/
