'use strict';
/**
 * [makeRequestOptions description]
 * @param  {string} from From currency - 3 characters ISO 4217 Currency Codes
 * @param  {string} to   To currency - 3 characters ISO 4217 Currency Codes
 * @return {object}      options to use for request module.
 */
function makeRequestOptions(from, to) {
	return {
		uri: 'http://www.xe.com/currencyconverter/convert/',
		timeout: 3000,
		qs: {
			Amount: 1,
			From: from, // USD
			To: to // HKD
		},
		headers: {
			// pretend to be a proxy.
			'X-Forwarded-For': [1, 2, 3, 4].map(n => Math.round(Math.random() * 253) + 1).join('.'),
			// Send user-agent as MacOS Chrome 53
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'
		}
	};
}
module.exports = makeRequestOptions;
