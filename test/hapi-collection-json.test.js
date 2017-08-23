'use strict';

var Hapi = require('hapi');
var Code = require('code');
var Lab = require('lab');
var debug = require('debug')('hapi-collection-json:test/index.js');

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
//var after = lab.after;

var server;
//var dataTest;
experiment('hapi-collection-json tests', function(){
    // create a micro server for tests
    before(function(done){
        server = new Hapi.Server();
        server.connection();

        //put routes here
        server.route({
            method: 'GET',
            path: '/data',
            config: {
                handler: function(request, reply){
                    reply();
                }
            }
        });

        server.register(require('../lib/index.js'), function(err){
            if(err) throw err;
            done();
        });
    });

    test('check content-type: wrong one', function(done){
        server.inject({
            method: 'GET',
            url: '/data',
            headers: {
                'content-type': 'application/json'
            }
        }, function(response){
            debug(response.result);
            expect(response.statusCode).to.be.equal(500);
            expect(response.result.collection).to.exists();
            expect(response.result.collection.error).to.exists();
            expect(response.result.collection.error.title).to.exists().and.to.be.equal('Internal Server Error');
            expect(response.result.collection.error.code).to.exists().and.to.be.equal(500);
            expect(response.result.collection.error.message).to.exists().and.to.be.equal('Invalid content type. Only allowed: application/vnd.collection+json');
            done();
        });
    });

    test('check content-type', function(done){
        server.inject({
            method: 'GET',
            url: '/data',
            headers: {
                'content-type': 'application/vnd.collection+json'
            }
        }, function(response){
            expect(response.statusCode).to.be.equal(200);
            expect(response.result.collection).to.exists();
            expect(response.result.collection.version).to.exists().and.to.be.equal('1.0');
            expect(response.result.collection.href).to.exists();
            done();
        });
    });
});
