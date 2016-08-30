(function(){
  "use strict";

  var Hapi = require("hapi");
  var Code = require("code");
  var Lab = require("lab");
  var hapiCollectionJson = require("../lib/index");

  var lab = exports.lab = Lab.script();
  var expect = Code.expect;
  var experiment = lab.experiment;
  var test = lab.test;
  var before = lab.before;
  var after = lab.after;

  var server;
  var dataTest;
  experiment("hapi-collection-json tests", function(){

    // create a micro server for tests
    before(function(done){
      server = new Hapi.Server();
      server.connection();
      server.ext("onPreResponse", hapiCollectionJson);
      dataTest = {}; // represents a data set.

      // Create
      server.route({
        method: "POST",
        path: "/data",
        handler: function(request, reply){
          var code = request.payload.code; // uuid
          var name = request.payload.name; //string
          var age = request.payload.age; // number
          var gender = request.payload.gender; // boolean

          var obj = {
            name: name,
            age: age,
            gender: gender
          };

          dataTest[code] = obj;

          reply();
        }
      });

      // Retrieve
      server.route({
        method: "GET",
        path: "/data/{code}",
        handler: function(request, reply){
          var code = request.params.code;

          var obj = dataTest[code];

          reply(obj);
        }
      });

      // Retrieve all
      server.route({
        method: "GET",
        path: "/data",
        handler: function(request, reply){
          reply(dataSet);
        }
      });


      // Update
      server.route({
        method: "PUT",
        path: "/data/{code}",
        handler: function(request, reply){
          var code = request.params.code; // uuid
          var name = request.payload.name; //string
          var age = request.payload.age; // number
          var gender = request.payload.gender; // boolean

          var obj = {
            name: name,
            age: age,
            gender: gender
          };

          dataTest[code] = obj;

          reply();
        }
      });

      // Delete
      server.route({
        method: "DELETE",
        path: "/data/{code}",
        handler: function(request, reply){
          delete dataTest[request.params.code];
          reply();
        }
      });

      done();
    });

    test("Create data", function(done){
      var request = {
        method: "POST",
        url: "/data",
        payload: {
          code: "D01",
          age: 10,
          gender: true,
          name: "Alice"
         }
      };

      server.inject(request, function(response){
        expect(response.statusCode).to.equal(200);
        done();
      });
       
    });

  });

})();
