'use strict';

var User = require('mongoose').model('User');

module.exports = {
  findUserByUsername: findUserByUsername
};

function findUserByUsername(req, res) {
  var username = req.swagger.params.username.value;
  console.log('Looking up user with username ' + username);
  User.findOne({
        username: username
      },
      function(err, user) {
        if (err) {
          console.log('Error trying to find user with username ' + username);
        } else {
          res.json(user);
        }
      }
  );
};