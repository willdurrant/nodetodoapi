var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var jwt = require('jsonwebtoken');
var sinon = require('sinon');
var mongoose = require('mongoose');
var fs = require('fs');

var proxyquire = require('proxyquire');
require('sinon-mongoose');

describe('controllers', function () {

    describe('user.controller', function () {

        describe('GET /api/secure/users', function () {

            it('should return a user based upon given username', function (done) {

                var controller = proxyquire('../../../api/controllers/user.controller',
                    {
                        '../helpers/helper': {
                            getBar: function () {
                                console.log('================================');
                                return 'Ive been stubbed!';
                            }
                        }
                    });

                should.exist(controller);
                controller.getBarPassthru().should.eql('Ive been stubbed!');


                var User = mongoose.model('User');
                var UserMock = sinon.mock(User);

                fs.readFile(__dirname + "/../../../api/json/" + "user.json", 'utf8', function (err, data) {
                    var expectedResult = JSON.parse(data);

                    UserMock
                        .expects('findOne').withArgs({username: "jsmith"})
                        .yields(null, expectedResult);

                    var token = jwt.sign(expectedResult, 'testSecret', {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });


                    request(server)
                        .get('/api/secure/users/jsmith')
                        .set('Accept', 'application/json')
                        .set('x-access-token', token)
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.eql(expectedResult);
                            UserMock.verify();
                            UserMock.restore();
                            done();
                        });

                });
            });

        });

    });

});
