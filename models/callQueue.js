'use strict';

// the whole idea of this model file seems a little strange so we'll see if it works

var lastZDCall = new Date(); //stores the last time the API was called
var queueJSON;

exports.updateQueueInfo = function(queueInfo, time) {
	queueJSON = queueInfo;
	lastZDCall = time;
	console.log(queueJSON);
	console.log(lastZDCall);
}

exports.getQueueInfo = function() {
	return queueJSON;
}