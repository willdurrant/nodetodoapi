'use strict'
console.log('+========== development config in use ================+')

var port = process.env.OPENSHIFT_NODEJS_PORT || 1337
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var secret = process.env.TODO_SECRET || 'testSecret'

module.exports = {
	port: port,
	server_ip_address: server_ip_address,
	db: 'mongodb://localhost/todos',
	secret: secret
};
