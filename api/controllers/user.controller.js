'use strict';

var helper = require('../helpers/helper');
var User = require('mongoose').model('User');

module.exports = {
    findUserByUsername: findUserByUsername,
    getBarPassthru: getBarPassthru
};

function getBarPassthru(req, res){
    return helper.getBar();
}

function findUserByUsername(req, res) {
    helper.validateToken(req, res);
    var username = req.swagger.params.username.value;
    console.log('Looking up user with username ' + username);
    User.findOne({
            username: username
        },
        function (err, user) {
            if (err) {
                console.log('Error trying to find user with username ' + username);
            } else {
                res.json(user);
            }
        }
    );
};