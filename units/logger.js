'use strict';
const app = require('../server/server.js');
const hostname = require('os').hostname();
app.locals.logs = [];
function myLogger() {
	const message = `[${hostname}] ${Array.prototype.join.call(arguments, ' ')}`;
	app.locals.logs.unshift(message);
	return app.models.Log.create({
		message: `[${hostname}] ${Array.prototype.join.call(arguments, ' ')}`
	});
}
module.exports = myLogger;
