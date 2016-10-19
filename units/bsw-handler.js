'use strict';
const co = require('co');
const rateExtractJob = require('./rate-extract-job.js');
// const Bluebird = require('bluebird');
/**
 * XeRateHandler implements bsw-handler.
 */
class XeRateHandler {
	* run(payload, job_info) {
		return yield co(rateExtractJob(payload));
	}
	/* Following code is trying to do things in a evil way... */
	// * run(payload, job_info) {
	// 	this.payload = payload;
	// 	let succeed = yield co(rateExtractJob(payload))
	// 		.then(function Success() {
	// 			return Bluebird.resolve(true);
	// 		}, function Fail() {
	// 			return Bluebird.resolve(false);
	// 		});
	// 	if (succeed) {
	// 		// bsw will delete the job.
	// 		return succeed;
	// 	} else {
	// 		// bsw will bury the job.
	// 		throw succeed;
	// 	}
	// }
	// final(action, delay, result) {
	// 	// onFinish later provided when have access to Worker instance. To handle reput conditions with extra data.
	// 	try {
	// 		this.onFinish(this.payload, result);
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// }
	/* --- end of evil --- */
}
module.exports = XeRateHandler;
