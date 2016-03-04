'use strict';
var fs = require('fs');

module.exports = {
  findUser: findUser
};

function findUser(req, res) {
  var username = req.swagger.params.username.value;
  fs.readFile( __dirname + "../../json/" + "user.json", 'utf8', function (err, data) {
    res.json(JSON.parse(data));
  });
}
