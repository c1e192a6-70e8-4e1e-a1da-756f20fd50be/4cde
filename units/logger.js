'use strict';
const app = require('../server/server.js');
const hostname = require('os').hostname();
function myLogger() {
	return app.models.Log.create({
		message: `[${hostname}] ${Array.prototype.join.call(arguments, ' ')}`
	});
}
module.exports = myLogger;
