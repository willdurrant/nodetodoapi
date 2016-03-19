'use strict';
var fs = require('fs');

module.exports = {
  authenticate: authenticate
};

function authenticate(req, res) {
  var username = req.swagger.params.username.value;
  fs.readFile( __dirname + "../../json/" + "user.json", 'utf8', function (err, data) {
    res.json(JSON.parse(data));
  });
}
