var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {
	var db = mongoose.connect(config.db);
	require('../api/models/todo.model');
	require('../api/models/user.model');
	return db;
};
