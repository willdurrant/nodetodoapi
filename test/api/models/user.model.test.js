var server = require('../../../app');
var should = require('should');
var mongoose = require('mongoose');

Todo = mongoose.model('Todo');
User = mongoose.model('User');

var user;
var todo;


describe('models', function () {

    describe('user.model', function () {


        it('should create new User object', function (done) {

            user = new User({
                "username": "jsmith",
                "name": "Test",
                "email": "test.user@gmail.com",
                "password": "password123"
            });

            user.save(function (err, persistedUser, numAffected) {
                if (err) {
                    console.log('Error saving user');
                }
                console.log('User successfully saved');

                todo = new Todo({
                    creator: persistedUser,
                    "status": {
                        "label": "Completed",
                        "priority": 3,
                    }
                    ,
                    "priority": {
                        "label": "Urgent",
                        "priority": 3,
                    }
                    ,
                    "completed": false,
                    "tag": "Work",
                    "comment": "",
                    "title": "22"
                });
                done();
            });
        });


        //afterEach(function (done) {
            //User.remove().exec(function (err) {
            //    if (err) console.log('Error removing Users')
            //    done();
            //});
        //});
    });
});

