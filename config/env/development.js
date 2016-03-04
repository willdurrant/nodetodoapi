// var port = 1337;

var port = process.env.OPENSHIFT_NODEJS_PORT || 1337
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'


module.exports = {
	port: port,
	server_ip_address: server_ip_address,
	db: 'mongodb://localhost/todos'
};
