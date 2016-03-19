'use strict';
var User = require('mongoose').model('User'),
    jwt = require('jsonwebtoken'),
    config = require('../../config/config');




module.exports = {
  authenticate: authenticate
};

function authenticate(req, res) {
  var authenticationRequest = req.swagger.params.body.value;

  console.log('authenticate api called...');
  var user = User.findOne({
    username: authenticationRequest.username
  }, function(err, _existingUser) {
    if (err) {
      return res.status(401).send({
        message: 'Error trying to authenticate user : ' + err
      });
    } else {
      if (err) throw err;
      if (!_existingUser) {
        res.status(401).send({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (_existingUser) {
        // check if password matches
        if(!_existingUser.authenticate(authenticationRequest.password)) {
          res.status(401).send({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {
          // if user is found and password is right
          // create a token
          var token = jwt.sign(_existingUser, config.secret, {
            expiresInMinutes: 1440 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    }
  });
};