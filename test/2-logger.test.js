'use strict';
const app = require('../server/server.js');
const assert = require('assert');
const logger = require('../units/logger.js');

describe('The Logger.', function () {
	let logInstance;
	before(function (done) {
		if (app._ready) {
			return done();
		}
		app.once('READY_FOR_TEST', function () {
			done();
		});
		return undefined;
	});
	it('Should be able to create a log', function (done) {
		this.timeout(10000);
		logger('testing').then(function (resolvedInstance) {
			logInstance = resolvedInstance;
			done();
		}, function (reject) {
			throw reject;
		});
	});

	it('Should be a valid exchange rate instance', function () {
		assert(logInstance.isValid());
	});

	it('Should have saved the log to database', function () {
		assert(Boolean(logInstance.id));
	});

	it('Should be able to delete the record by calling destroy on it', function (done) {
		logInstance.destroy(function (err, info) {
			if (err) throw err;
			assert(info.count === 1);
			done();
		});
	});

	it('The record should have been deleted from database now', function (done) {
		logInstance.reload(function (err, instance) {
			assert(!instance);
			done();
		});
	});
});
