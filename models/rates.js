'use strict';

module.exports = function (Rates) {
	Rates.validatesLengthOf('from', {is: 3, messsage: {is: 'Currency code should be 3 characters'}});
	Rates.validatesLengthOf('to', {is: 3, messsage: {is: 'Currency code should be 3 characters'}});
	Rates.validatesNumericalityOf('rate', {message: {number: 'Rate should be a number'}});
};
