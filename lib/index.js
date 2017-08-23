'use strict';

var debug = require('debug')('hapi-collection-json:index.js');
var cj = require('./collectionJSON.js');
var Boom = require('boom');

exports.register = function(server, options, next){
    function getFullURL(request){
        return request.connection.info.protocol + '://'+ request.info.host + request.url.path;
    }

    // onRequest extension
    server.ext('onRequest', function(request, reply){
        var ct = request.headers['content-type'];
        
        if(ct !== 'application/vnd.collection+json'){
            var err = Boom.badImplementation('Invalid content type. Only allowed: application/vnd.collection+json');
            debug('err = ', err);
            return reply(err);
        }else{
            return reply.continue();
        }
    });

    server.ext('onPreResponse', function(request, reply){
        var response = request.response;

        var resp = new cj(getFullURL(request));

        if(response.isBoom){
            resp.formatError(response);
            response.statusCode = response.output.statusCode;
        }

        return reply(resp.document).code(response.statusCode);
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
