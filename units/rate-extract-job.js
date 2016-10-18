'use strict';

const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const xeRequestOptionsFactory = require('./xe-request-options.js');
const rateExtractor = require('./rate-extractor.js');
const app = require('../server/server.js');
/**
 * try to get exchange rate from xe, throws errors when anything goes wrong.
 * @param  {string} payload.from From currency - 3 characters ISO 4217 Currency Codes
 * @param  {string} payload.to   To currency - 3 characters ISO 4217 Currency Codes
 * @yield {promise} [description]
 */
function* getExchangeRateJob(payload) {
	// Type Checking :)
	const from = payload.from.toUpperCase();
	const to = payload.to.toUpperCase();
	if (from.length !== 3 || to.length !== 3) throw new Error('EXTRACT_RATE_JOB_UNEXPECT_CURRENCY_CODE');

	// Get Rate from xe.com
	const request_options = xeRequestOptionsFactory(from, to);
	const exchange_rate_page = yield requestPromise(request_options);

	// Parse the page
	const $ = cheerio.load(exchange_rate_page);

	const rounded_rate_string = rateExtractor(from, to, $('body').text());

	const new_rate_record = new app.models.Rates({
		from,
		to,
		rate: rounded_rate_string,
		created_at: new Date()
	});

	if (new_rate_record.isValid()) {
		yield new_rate_record.save();
	} else {
		console.log(new_rate_record);
		throw new Error('EXTRACT_RATE_JOB_RECORD_NOT_VALID');
	}

	return new_rate_record;
}

module.exports = getExchangeRateJob;
