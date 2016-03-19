'use strict'
console.log('+========== production config in use ================+')

var port = process.env.OPENSHIFT_NODEJS_PORT || 1337
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'


var	db_connection_string = process.env.OPENSHIFT_EXTMONGODB_DB_USERNAME + ":" +
	process.env.OPENSHIFT_EXTMONGODB_DB_PASSWORD + "@" +
	process.env.OPENSHIFT_EXTMONGODB_DB_HOST + ':' +
	process.env.OPENSHIFT_EXTMONGODB_DB_PORT + '/' +
	process.env.OPENSHIFT_EXTAPP_NAME;

console.log('+========== Start: Prod properties ================+')
console.log('+== port : ' + port)
console.log('+== server_ip_address : ' + server_ip_address)
console.log('+== db : ' + db_connection_string)
console.log('+== secret : ' + process.env.TODO_SECRET)
console.log('+========== End: Prod properties ================+')

module.exports = {
	port: port,
	server_ip_address: server_ip_address,
	db: db_connection_string,
	secret: process.env.TODO_SECRET
};
