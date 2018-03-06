/*
./node_modules/.bin/db-migrate up --env test && \
./node_modules/.bin/jasmine-node --verbose --captureExceptions ./spec/
*/

'use strict'
var request = require('request')
var dbSession = require('../../src/backend/dbSession.js')
var resetDatabase = require('../resetDatabase.js')
var Server = require('../../src/backend/server.js').Server
var async = require('async')


describe('The api', function() {

  var server

  beforeEach(function(done) {
    server = Server(8081)
    server.listen(function(err) {
      resetDatabase(dbSession, function() {
        done(err)
      })
    })
  })

  afterEach(function(done) {
    server.close(function() {
      resetDatabase(dbSession, function() {
        done()
      })
    })
  })


  it('should respond to GET request at /api/keywords/', function(done) {
    var expected = {
      '_items': [
        {'id': 1, 'value': 'Adam', 'categoryID': 1},
        {'id': 2, 'value': 'Bozena', 'categoryID': 1},
        {'id': 3, 'value': 'Knife', 'categoryID': 2}
      ] /*,
      '_links': {
        'parent': {
          'href': 'http://localhost:8081/api'
        }
      }*/
    };

    async.series(
    [


        function(callback) {
          console.log('filling first db row');
          dbSession.insert('keyword',
            {'value': 'Adam', 'categoryID': 1},
            function(err) { callback(err) }
            )
        },
        function(callback) {
          dbSession.insert('keyword',
            {'value': 'Bozena', 'categoryID': 1},
            function(err) { callback(err) }
          )
        },
        function(callback) {
          dbSession.insert('keyword',
            {'value': 'Knife', 'categoryID': 2},
            function(err) { callback(err) }
          )
        }
      ],

      function(err, results) {
        if(err) throw(err)
        request(
          {
          'method': 'GET',
          'uri': 'http://localhost:8081/api/keywords/',
          'json': true
          },
          function(err, res, body) {
            // console.log('right before first expect');
            expect(res.statusCode).toBe(200)
            // console.log('rigth after first expect');
            expect(body).toEqual(expected)
            done()
          }
        )
      }
    )
  })

  it('should respond to GET request at /api/categories', function(done) {
    var expected = {
      "__items": [
        {'id': 1, 'name': 'Vegetable'},
        {'id': 2, 'name': 'Uchyl'}
      ]
    }

    async.series(
      [
        function(callback) {
          resetDatabase(dbSession, callback)
        },

        function(callback) {
          dbSession.insert(
            'category',
            {'name': 'Vegetable'},
            function(err) { callback(err) }
          )
        },

        function(callback) {
          dbSession.insert(
            'category',
            {'name': 'Uchyl'},
            function(err) { callback(err) }
          )
        }

      ],

      function(err, results) {
        if (err) throw(err)
        request({
          'method': 'GET',
          'uri': 'http://localhost:8081/api/keywords/categories/',
          'json': true
        },
          function(err, res, body) {
            expect(res.statusCode).toBe(200)
            expect(body).toEqual(expected)
            done()
          }
        )
      }

    )

  })
})
