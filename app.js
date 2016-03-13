'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var mongoose = require('./config/mongoose');
var db = mongoose();

var app = require('express')();
module.exports = app; // for testing

var appRootDir = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(appRootDir, function(err, swaggerExpress) {
  if (err) { throw err; }

  // Add swagger-ui (This must be before swaggerExpress.register)
  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  //console.log(process.env.NODE_ENV + ' Using mongodb connection URL ' + config.db);

  //if (swaggerExpress.runner.swagger.paths['/hello']) {
  //  console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  //}

  //if (swaggerExpress.runner.swagger.paths['/api/secure']) {
  //  console.log('validating token for /api/secure URL');
  //}

});
