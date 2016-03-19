var server = require('../../../app');
var should = require('should');
var mongoose = require('mongoose');

Todo = mongoose.model('Todo');
User = mongoose.model('User');

var user;
var todo;


describe('models', function () {

    describe('todo.model', function () {

        beforeEach(function (done) {
            user = new User({
                "username": "testuser",
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

        describe('Create and find new Todo', function () {


            it('should create then find the newly persisted todo', function (done) {

                todo.save(function (err, persistedTodo) {
                    should.not.exist(err);
                    should.exist(persistedTodo);
                    should.exist(persistedTodo._id);
                    Todo.findById(persistedTodo._id).exec(function (err, retrievedTodo) {
                        should.not.exist(err);
                        should.exist(retrievedTodo);
                        done();
                    });
                });
            });

        });


        afterEach(function (done) {
            Todo.remove().exec(function (err) {
                if (err) console.log('Error removing Todos')

                User.remove().exec(function (err) {
                    if (err) console.log('Error removing Users')
                    done();
                });

            });
        });
    });
});

