// var port = 1337;

var port = process.env.OPENSHIFT_NODEJS_PORT || 1337
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'


module.exports = {
	port: port,
	server_ip_address: server_ip_address,
	db: 'mongodb://localhost/todos',
	superSecret: 'dofiublcktyidfy',
	facebook: {
		clientID: '513828288756645',
		clientSecret: '2d7cc991efddb864e9af61f307980b9a',
		callbackURL: 'http://localhost:'+ port +'/oauth/facebook/callback'
	},
	twitter: {
		clientID: 'yFntGKkvMZkDKL47XGtzLNdRA',
		clientSecret: 'EAiPTjPYLX5nrkpRtxYQflbWpRTqqLwwBHRLh7WpdQ1P69Tre6',
		callbackURL: 'http://localhost:'+ port +'/oauth/twitter/callback'
	}
};
