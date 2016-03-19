var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var jwt = require('jsonwebtoken');
var config = require('../../../config/config');
var sinon = require('sinon');
var mongoose = require('mongoose');
require('sinon-mongoose');

describe('controllers', function () {

    describe('tag.controller', function () {

        describe('GET /api/secure/tags', function () {

            it('should return all tags for given user', function (done) {

                var Todo = mongoose.model('Todo');
                var TodoMock = sinon.mock(Todo);

                var expectedResult = ['Work', 'Internet'];

                TodoMock
                    .expects('find').withArgs({creator: "56dd9e0a0f118274588ca53c"})
                    .chain('distinct', 'tag')
                    .chain('exec')
                    .yields(null, expectedResult);

                var token = jwt.sign(expectedResult, config.secret, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                request(server)
                    .get('/api/secure/tags')
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
    });
});
