'use strict'
console.log('+========== test config in use ================+')

var port = 10010
var server_ip_address = '127.0.0.1'
var secret = 'testSecret'

module.exports = {
	port: port,
	server_ip_address: server_ip_address,
	db: 'mongodb://localhost/todos',
	secret: secret
};