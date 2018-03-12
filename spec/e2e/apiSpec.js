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

  it('should respond to GET request at /api/category/', function(done) {
    var expected = {
      "_items": [
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

  it('should create new keyword when receiving a POST request at /api/keywords', function(done) {

    var expected = {
      "_items": [
        { 'id': 1, 'value': 'Aubergine', 'categoryID': '1' },
        { 'id': 1, 'value': 'Onion', 'categoryID': '1'}
      ]
    }

    var body = {
      'value': 'Onion',
      'categoryID': 1
    }

    async.series(
      [
        function(callback) {
          dbSession.insert(
            'category',
            { 'name': 'Vegetable' },
            function(err) { callback(err) }
          )},

        function(callback) {
          dbSession.insert(
            'keyword',
            { 'value': 'Aubergine', 'categoryID': 1 },
            function(err) { callback(err) }
          )
        }

      ],

      function(err, results) {
        if (err) throw (err)
        request({
            'method': 'POST',
            'uri': 'http://localhost:8081/api/keywords/',
            'body': body,
            'json': true
          },
          function(err, res, body) {
            if (err) throw (err)
            expect(res.statusCode).toBe(200)
              request({
                'method': 'GET',
                'uri': 'http://localhost:8081/api/keywords',
                'json': true
              },
              function(err, res, body) {
                if (err) throw (err)
                expect(res.statusCode).toBe(200)
                expect(body).toEqual(expected)
                done()
              }

            )
          }
        )
      }

    )

  })

  it('should update a keyword when receiving a POST reques at /api/keywords/:i/', function(done) {
    var expected = {
      '_items': [
        { 'id': 1, 'value': 'Onion', 'categoryID': 2}
      ]
    }

    var body = {
      'id' 1,
      'value': 'Onion',
      'categoryID': 2
    }

    async.series(
    [
      function(callback) {
        dbSession.insert('category',
          { 'name': 'Vegetable' },
          function(err) { callback(err) }
        )
      },
      function(callback) {
        dbSession.insert('category',
          { 'name': 'Utility' },
          function(err) { callback(err) }
        )
      },
      function(callback) {
        dbSession.insert('keyword',
          { 'value': 'Aubergine', 'categoryID': 1},
          function(err) { callback(err) }
        )
      }
    ], function(err, results) {
      if (err) throw (err)
      request({
          'method': 'POST',
          'uri': 'http://localhost:8081/api/keywords/1',
          'body': body,
          'json': true
        },
        function(err, res, body) {
          if (err) throw (err)
          expect(res.statusCode).toBe(200)
          request({
            'method': 'GET',
            'uri': 'http://localhost:8081/api/keywords/',
            'json': true
          },
          function(err, res, body) {
            if (err) throw (err)
            expect(res.statusCode).toBe(200)
            expect(body).toEqual(expected)
            done()
          }

          )
        }
      )
    }

    )

  })

  it('should delete a keyword where receiving DELETE request at /api/keywords/:id', function(done) {
    var expected = {
      '_items': [
        { 'id':, 1, 'value': 'Aubergine', 'categoryID': 1}
      ]
    }

    async.series(
      [
        function(callback) {
          dbSession.insert('category',
            { 'name': 'Vegetable' },
            function(err) { callback(err) }
          )
        },
        function (callback) {
          dbSession.insert('keyword',
            { 'value': 'Aubergine', 'categoryID': 1 },
            function (err) { callback(err) }
          )
        },
        function (callback) {
          dbSession.insert('keyword',
            { 'value': 'Onion', 'categoryID': 1 },
            function (err) { callback(err) }
          )
        }
      ], function(err, results) {
        if (err) throw (err)
        request.del(
          {
            'uri': 'http://localhost:8081/api/keywords/2/',
            'json': true
          }, function(err, res, body) {
            if (err) throw (err)
            request(
              {
                'method': 'GET',
                'uri': 'http://localhost:8081:/api/keywords/',
                'json': true
              },
              function(err, res, body) {
                if (err) throw (err)
                expect(res.statusCode).tobe(200)
                expect(body).toEqual(expected)
                done()
              }
            )
          }

        )

      }
    )

  })

})
