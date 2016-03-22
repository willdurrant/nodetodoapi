var server = require('../../../app');
var jwt = require('jsonwebtoken');
var config = require('../../../config/config');
var should = require('should');
var request = require('supertest');
var sinon = require('sinon');
var mongoose = require('mongoose');
var fs = require('fs');
require('sinon-mongoose');

describe('controllers', function () {

    describe('todo.controller', function () {

        describe('GET /api/secure/todos', function () {

            it('should return a list of todos (using sinon with callbacks)', function (done) {

                var Todo = mongoose.model('Todo');
                var TodoMock = sinon.mock(Todo);

                fs.readFile(__dirname + "/../../../api/json/" + "todos.json", 'utf8', function (err, data) {
                    var expectedResult = JSON.parse(data);


                    TodoMock
                        .expects('find').withArgs({creator: "56dd9e0a0f118274588ca53c"})
                        .chain('sort', 'priority.priority')
                        .chain('exec')
                        .yields(null, expectedResult);

                    var token = jwt.sign(expectedResult, config.secret, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    request(server)
                        .get('/api/secure/todos')
                        .query({creator: '56dd9e0a0f118274588ca53c'})
                        .set('Accept', 'application/json')
                        .set('x-access-token', token)
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);

                            TodoMock.verify();
                            TodoMock.restore();

                            res.body.should.eql(expectedResult);
                            done();
                        });

                });
            });


/*
            it('should allow a todo to be updated', function (done) {

                var Todo = mongoose.model('Todo');
                var TodoMock = sinon.mock(Todo);

                fs.readFile(__dirname + "/../../../api/json/" + "updateTodo.json", 'utf8', function (err, data) {
                    var todoForUpdating = JSON.parse(data);


                    TodoMock
                        .expects('find').withArgs({creator: "56dd9e0a0f118274588ca53c"})
                        .chain('sort', 'priority.priority')
                        .chain('exec')
                        .yields(null, todoForUpdating);

                    var token = jwt.sign(todoForUpdating, config.secret, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    request(server)
                        .put('/api/secure/todos/' + todoForUpdating._id)
                        .set('Accept', 'application/json')
                        .set('x-access-token', token)
                        .send(todoForUpdating)
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);

                            TodoMock.verify();
                            TodoMock.restore();

                            res.body.should.eql(todoForUpdating);
                            done();
                        });

                });
            });
 */

        });


    });

});
