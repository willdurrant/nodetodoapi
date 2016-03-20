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
            verifyCallbackStub.yields(null, 'mockDecoder'); //stub calls callback passed to verify() with the provided arguments

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

            var testJsonWebToken = require('jsonwebtoken');
            var verifyCallbackStub = sinon.stub(testJsonWebToken, 'verify')
            verifyCallbackStub.yields('someErr', null); //stub calls callback passed to verify() with the provided err arguments

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
            sinon.spy(response, "json");
            var expectedJson = {
                success: false,
                message: 'Failed to authenticate token.'
            };

            //execute test
            moduleUnderTest.validateToken(request, response);
            response.json.calledOnce;
            response.json.getCall(0).args[0].should.be.eql(expectedJson);

            verifyCallbackStub.withArgs(mockToken, 'testSecret').called.should.equal(true);
            done();

            after(function (done) {
                response.json.restore();
                verifyCallbackStub.restore();
                done();
            });
        });

        it('should fail with http status of 403 if no token passed in', function (done) {

            var moduleUnderTest = proxyquire('../../../api/helpers/helper',
                {
                    '../../config/config': {
                        db: '' //set mongo to empty string or else it will try to start an instance
                    }
                }
            );

            var req = httpMocks.createRequest({
                headers: {'x-access-token': null}
            });

            var res = httpMocks.createResponse();
            sinon.spy(res, "status");
            var sendSpy = res.send = sinon.spy(); //trick for wrapping nested function

            var expectedStatus = 403;
            var expectedSendMsg = { message: 'No token provided.', success: false };

            moduleUnderTest.validateToken(req, res);
            res.status.getCall(0).args[0].should.be.eql(expectedStatus);
            sendSpy.calledOnce.should.be.equal(true);
            sendSpy.getCall(0).args[0].should.be.eql(expectedSendMsg);
            done();

            after(function (done) {
                res.status.restore();
                done();
            });
        });

    });

});