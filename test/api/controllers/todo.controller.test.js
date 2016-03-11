var should = require('should');
var request = require('supertest');
var server = require('../../../app');
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


                    request(server)
                        .get('/api/secure/todos')
                        .query({creator: '56dd9e0a0f118274588ca53c'})
                        .set('Accept', 'application/json')
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

        });

    });

});
