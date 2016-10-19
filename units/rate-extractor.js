'use strict';
const BigNumber = require('bignumber.js');
/**
 * Extracts exchange rate present in format like `1 usd = 100.00 jpy` from text,
 * throws Error when fail to extract a unique presentation.
 * @param  {string} from From currency - 3 characters ISO 4217 Currency Codes
 * @param  {string} to   To currency - 3 characters ISO 4217 Currency Codes
 * @param  {string} text Body text of article / page.
 * @return {string}      Exchange rate rounded to 2 digits.
 */
function rateExtractor(from, to, text) {
	if (typeof text !== 'string') {
		throw new TypeError('RATE_EXTRACTOR_EXPECT_STING');
	}
	const tightText = text.replace(/\r\n|\r|\n|\s/g, '');
	// The exchange rates RegExp pattern for text without spaces
	const exchange_rate_pattern = new RegExp(`[1|1\.00]${from}=[0-9]+\.[0-9]+${to}`, 'gi'); // eslint-disable-line

	const exchange_rate_matches = tightText.match(exchange_rate_pattern);

	// Test if all matches suggest the same exchange rate.
	const exchange_rate = exchange_rate_matches.reduce((prev, curr) => {
		/* Test if all matched exchange rate tells the same sotry */
		if (prev === undefined) return new BigNumber(getRateString(curr));
		let currNumber = new BigNumber(getRateString(curr));
		if (prev.equals(currNumber)) {
			return currNumber;
		} else {
			throw new Error('RATE_EXTRACTOR_MULTIPLE_RATE_MATCHED');
		}
	}, undefined);

	return exchange_rate.round(2).toString();

	function getRateString(machedExchangeRateString) {
		// matched exchange rate string looks like 1usd=1.00usd or 1.00usd=1.00usd;
		return machedExchangeRateString.split('=').map(str => str.replace(/[a-z]/gi, ''))[1];
	}
}
module.exports = rateExtractor;
