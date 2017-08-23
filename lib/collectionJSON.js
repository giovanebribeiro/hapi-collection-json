'use strict';

function CJ(url){
    this.document = {
        collection:{
            version: '1.0',
            href: url
        }
    };
}

CJ.prototype = {
    /**
     * Put the error object (boom object) on collection.json structure 
     */
    formatError: function(response){
        this.document.collection.error = {
            title: response.output.payload.error,
            code: response.output.statusCode,
            message: response.message
        };
    }
};

module.exports = CJ;
