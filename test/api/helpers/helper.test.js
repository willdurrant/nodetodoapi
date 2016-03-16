'use strict'
process.env.NODE_ENV = 'test';
var should = require('should');
var sinon = require('sinon');
var httpMocks = require('node-mocks-http');
var proxyquire = require('proxyquire');

describe('helper', function () {

    describe('testing validateToken()', function () {

        it('should pass without error for a valid token', function (done) {

            before(function (done) {
                done();
            });

            var mockDecoder = {};
            var testJsonWebToken = require('jsonwebtoken');
            var verifyCallbackStub = sinon.stub(testJsonWebToken, 'verify')
            verifyCallbackStub.yields(null,'mockDecoder'); //stub calls callback passed to verify() with the provided arguments

            var moduleUnderTest = proxyquire('../../../api/helpers/helper',
                {
                    '../../config/config': {
                        db: '' //set mongo to empty string or else it will try to start an instance
                    }
                }
                , {
                    'jsonwebtoken': testJsonWebToken
                }
            );

            var mockToken = 'abcd';
            var request = httpMocks.createRequest({
                headers: {'x-access-token': mockToken},
            });

            //execute test
            moduleUnderTest.validateToken(request, null);

            verifyCallbackStub.restore();
            verifyCallbackStub.withArgs(mockToken, 'testSecret').called.should.equal(true);
            done();

        });

        it('should fail for an invalid valid token', function (done) {

            before(function (done) {
                done();
            });

            var mockDecoder = {};
            var testJsonWebToken = require('jsonwebtoken');
            var verifyCallbackStub = sinon.stub(testJsonWebToken, 'verify')
            verifyCallbackStub.yields('someErr',null); //stub calls callback passed to verify() with the provided err arguments

            var moduleUnderTest = proxyquire('../../../api/helpers/helper',
                {
                    '../../config/config': {
                        db: '' //set mongo to empty string or else it will try to start an instance
                    }
                }
                , {
                    'jsonwebtoken': testJsonWebToken
                }
            );

            var mockToken = 'abcd';
            var request = httpMocks.createRequest({
                headers: {'x-access-token': mockToken},
            });

            var response = httpMocks.createResponse();
            //response.json = {foo:'kjlj'};
            response.json = function(){
                console.log('sdfdsfsdf');
                return {foo:'bar'};
            }

            //execute test
            console.log('iweurywey ' + JSON.parse(moduleUnderTest.validateToken(request, response)));

            verifyCallbackStub.restore();
            verifyCallbackStub.withArgs(mockToken, 'testSecret').called.should.equal(true);
            done();

        });


    });

});