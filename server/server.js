'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');

const app = module.exports = loopback();

app.start = function () {
	// start the web server
	return app.listen(function () {
		app.emit('started');
		const baseUrl = app.get('url').replace(/\/$/, '');
		console.log('Web server listening at: %s', baseUrl);
		if (app.get('loopback-component-explorer')) {
			const explorerPath = app.get('loopback-component-explorer').mountPath;
			console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
		}
	});
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
	if (err) throw err;

	// start the server if `$ node server.js`
	if (require.main === module) {
		require('express-repl-toolkit')(app);
		console.log(`BSW worker listening on tube: ${app.get('BS_TUBE')}  host: ${app.get('BS_HOST')}  port: ${app.get('BS_PORT')}`);
		app._bswWorker.start();
		app.start();
	}
	app.emit('READY_FOR_TEST');
});
app._ready = false;
app.once('READY_FOR_TEST', function () {
	app._ready = true;
});
