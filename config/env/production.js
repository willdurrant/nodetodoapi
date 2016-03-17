'use strict'
console.log('+========== production config in use ================+')

var port = process.env.OPENSHIFT_NODEJS_PORT || 1337
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'


var	db_connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
	process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
	process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
	process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
	process.env.OPENSHIFT_APP_NAME;


module.exports = {
	port: port,
	server_ip_address: server_ip_address,
	db: db_connection_string,
	secret: process.env.TODO_SECRET
};
