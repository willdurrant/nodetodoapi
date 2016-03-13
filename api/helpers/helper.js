'use strict'
var jwt = require('jsonwebtoken');

var secret = process.env.TODO_SECRET || 'testSecret';

module.exports = {
    getErrorMessage: getErrorMessage,
    validateToken: validateToken,
    getBar: getBar
}

function getBar(){
    return 'Bar';
}


function getErrorMessage(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

function validateToken(req, res) {
    console.log('validateToken called...');
    var token = req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        //jwt.verify(token, process.env.TODO_SECRET, function(err, decoded) {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                console.log('Token is valid');
                return;
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    };
};

