'use strict';
const Worker = require('bsw');
const XeRateHandler = require('./bsw-handler.js');

function mountWorker(app) {
	if (!app._bswWorker) {
		// Creqte bsw worker instance;
		const worker = new Worker({
			tube: app.get('BS_TUBE'),
			host: app.get('BS_HOST'),
			port: app.get('BS_PORT'),
			handler: XeRateHandler,
			logger: require('./logger.js')
		});

		app._bswWorker = worker;

		worker.on('JOB_RESERVED', function (event) {
			console.log('Rate extract job started with payload:', event.payload);
		});

		worker.on('JOB_FINISHED', function (event) {
			console.log('Rate extract job finished with result:', event.result);
			const payload = event.payload;
			const result = event.result;
			let succeed;
			if (result && result.id) {
				succeed = true;
			} else {
				succeed = false;
			}
			if (succeed) {
				payload.succeed_count ? payload.succeed_count += 1 : payload.succeed_count = 1;
			} else {
				payload.fail_count ? payload.fail_count += 1 : payload.fail_count = 1;
			}
			// Stop the task if you tried 10 succeed attempts or 3 failed attempts in total.
			if ((payload.succeed_count && payload.succeed_count >= 10) || (payload.fail_count && payload.fail_count >= 3)) {
				return;
			}
			// Reput Strategy
			try {
				if (succeed) {
					// If request is succeed, reput to the tube and delay with 60s.
					// fivebeans: client.put(priority (int 0-1024), delay(int seconds), ttr (int seconds), payload, function(err, jobid) {});
					worker.client.put(200, 60, 10, JSON.stringify(payload), function (err, jobid) {});
				} else {
					// If request is failed, reput to the tube and delay with 3s.
					worker.client.put(200, 3, 10, JSON.stringify(payload), function (err, jobid) {});
				}
			} catch (e) {
				// client is not there or stoped.
				// TODO: Maybe make a closure for this block to retry reputing.
			}
		});
		// // abusing prototype chain....
		// XeRateHandler.prototype.onFinish = function (payload, succeed) {
		// 	if (succeed) {
		// 		payload.succeed_count ? payload.succeed_count += 1 : payload.succeed_count = 1;
		// 	} else {
		// 		payload.fail_count ? payload.fail_count += 1 : payload.fail_count = 1;
		// 	}
		// 	// Stop the task if you tried 10 succeed attempts or 3 failed attempts in total.
		// 	if ((payload.succeed_count && payload.succeed_count >= 10) || (payload.fail_count && payload.fail_count >= 3)) {
		// 		return;
		// 	}
		// 	if (succeed) {
		// 		// If request is succeed, reput to the tube and delay with 60s.
		// 		// fivebeans: client.put(priority, delay, ttr, payload, function(err, jobid) {});
		// 		worker.client.put(200, 60, 3600, payload, function (err, jobid) {});
		// 	} else {
		// 		// If request is failed, reput to the tube and delay with 3s.
		// 		worker.client.put(200, 3, 3600, payload, function (err, jobid) {});
		// 	}
		// };
		Object.defineProperty(app.locals, 'bsConnected', {
			get: function () {
				return worker.client && worker.connected;
			}
		});
	}
}
module.exports = mountWorker;
