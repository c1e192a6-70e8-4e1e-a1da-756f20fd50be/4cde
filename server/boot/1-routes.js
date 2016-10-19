'use strict';

module.exports = function (server) {
	// Install a `/` route that returns server status
	const router = server.loopback.Router();
	router.get('/', showStatus());
	function showStatus() {
		const started = new Date();
		return function (req, res) {
			res.send({
				'started': started,
				'uptime': (Date.now() - Number(started)) / 1000,
				'beanstalkd_connected': server.locals.bsConnected,
				'mongo_connected': server.dataSources.mongo.connected
			});
		};
	}
	router.get('/logs', showLocalLogs);
	function showLocalLogs(req, res) {
		res.render('logs');
	}
	server.use(router);
};
