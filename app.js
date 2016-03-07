'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var SwaggerExpress = require('swagger-express-mw');
var mongoose = require('./config/mongoose');
var db = mongoose();

var app = require('express')();
module.exports = app; // for testing

var appRootDir = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(appRootDir, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  //console.log(process.env.NODE_ENV + ' Using mongodb connection URL ' + config.db);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
