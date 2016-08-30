var debug = require("debug")("hapi-collection-json");

module.exports = function(request, reply){
  if(request.headers.origin){
    return reply.continue();
  }

  debug(request.response);

  reply.continue();
};
