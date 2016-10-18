'use strict';
const rateExtractor = require('../units/rate-extractor.js');
const assert = require('assert');
const dummyCorrectInput = '1 usd =7.75891 hkd and 1 USD = 7.75891 HKD';
const dummyMupltipalRates = '1 usd = 7.5 hkd and 1 usd = 7.7 hkd';

describe('Rate extractor', function () {
	it('should give correct result (string rounded to 2 digit) when input is correct', function () {
		assert(rateExtractor('usd', 'hkd', dummyCorrectInput) === '7.76');
	});

	it('should throw an error when not able to extract exchange rate', function () {
		assert.throws(() => rateExtractor('usd', 'usd', dummyCorrectInput));
	});

	it('should throw an error when there are more then one exchange rate suggested in text', function () {
		assert.throws(() => rateExtractor('usd', 'hkd', dummyMupltipalRates));
	});

	it('should throw an error when input text is empty', function () {
		assert.throws(() => rateExtractor('usd', 'hkd', ''));
	});
});
