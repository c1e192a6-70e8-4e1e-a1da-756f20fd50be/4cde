'use strict';
const app = require('../server/server.js');
const assert = require('assert');
const co = require('co');
const rateExtractJob = require('../units/rate-extract-job');

before(function (done) {
	if (app._ready) return done();
	app.once('READY_FOR_TEST', function () {
		done();
	});
	return undefined;
});
describe('The job extracting exchange rate from co.', function () {
	let exchangeRateInstance;

	it('Should able to get exchange rate', function (done) {
		this.timeout(10000);
		co(function* () {
			exchangeRateInstance = yield co(rateExtractJob({from: 'HKD', to: 'USD'}));
			return exchangeRateInstance;
		}).then(function (resolve) {
			done();
		}, function (reject) {
			throw reject;
		});
	});

	it('Should be a valid exchange rate instance', function () {
		assert(exchangeRateInstance.isValid());
	});

	it('Should have been saved to database', function () {
		assert(Boolean(exchangeRateInstance.id));
	});

	it('Should be able to delete the record by calling destroy on it', function (done) {
		exchangeRateInstance.destroy(function (err, info) {
			if (err) throw err;
			assert(info.count === 1);
			done();
		});
	});

	it('The record should have been deleted from database now', function () {
		exchangeRateInstance.reload(function (err, instance) {
			assert(typeof instance === undefined);
		});
	});
});
