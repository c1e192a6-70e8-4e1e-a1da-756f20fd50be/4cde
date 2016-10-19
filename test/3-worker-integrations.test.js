'use strict';
const app = require('../server/server.js');
const assert = require('assert');

describe('Beanstalk worker Integration', function () {
	before(function (done) {
		if (app._ready) {
			// start the bsw worker.
			app._bswWorker.start();
			return done();
		}
		app.once('READY_FOR_TEST', function () {
			app._bswWorker.start();
			done();
		});
		return undefined;
	});
	it('Beanstalk server should be connected within 2 second.', function (done) {
		this.timeout(5000);
		setTimeout(function () {
			assert(app._bswWorker.connected);
			done();
		}, 2000);
	});
});
