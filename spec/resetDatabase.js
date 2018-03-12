'use strict'

var async = require('async')
var env = require('../src/backend/env')
var dbOptions = require('../database.json')[env]

var resetDatabase = function(dbSession, callback) {

  if (dbOptions.driver === 'sqlite3') {
    async.series(
      [
        function(callback) {
          dbSession.remove('keyword', '1', function(err) {
            callback(err)
          })
        },
        function(callback) {
          dbSession.remove('category', '1', function(err) {
            callback(err)
          })
        },
        function(callback) {
          dbSession.remove('sqlite_sequence', '1', function(err) {
            callback(err, null)
          })
        }

      ],
      function(err, results) {
        callback(err)
      }
    )

  }

  if (dbOptions.driver === 'mysql') {
    async.series(
      [
        function(callback) {
          dbSession.remove('TRUNCATE keyword', [], function(err){
            callback(err)
          })
        },
        function(callback) {
          dbSession.remove('TRUNCATE category', [], function(err) {
            callback(err)
          })
        }
      ],
      function(err, results) {
        callback(err)
      }
    )
  }

}


module.exports = resetDatabase


/*

// Z OFIKO DOCS:


module.exports = resetDatabase


var DBWrapper = require('node-dbi').DBWrapper;
var DBExpr = require('node-dbi').DBExpr;
var dbConnectionConfig = {
  host: 'localhost',
  password: 'test',
  user: 'test',
  database: 'test'
};

var dbWrapper = new DBWrapper('sqlite3', dbConnectionConfig)
dbWrapper.connect()
console.log(dbWrapper.isConnected())






var DBWrapper = require('node-dbi').DBWrapper;
var DBExpr = require('node-dbi').DBExpr;
var dbConnectionConfig = { host: 'localhost', user: 'test', password: 'test', database: 'test' };

// Replace the adapter name with "mysql", "mysql-libmysqlclient", "sqlite3" or "pg" on the following line :
dbWrapper = new DBWrapper( '[DB engine adapter name]', dbConnectionConfig );
dbWrapper.connect();

// ** fetchAll
dbWrapper.fetchAll('SELECT * FROM user', null, function(err, result) {
    if( ! result )
        console.dir(result);
    // "result" is an Array with a hash for every returned row
} );

// ** fetchRow ( +  a safely escaped value )
dbWrapper.fetchRow('SELECT * FROM user WHERE first_name=?', ['John'], function(err, result) {
    if( ! result )
        console.dir(result);
    // this time, "result" is a single hash (the first returned row)
} );

// ** fetchCol  (if you dont' have values to escape, the 2nd param can be an empty Array or "null")
dbWrapper.fetchCol('SELECT first_name FROM user ORDER BY fist_name', null, function(err, result) {
    if( ! err )
        console.dir(result);
    // "result" is an Array with all the names of our users, sorted alphabetically
} );

// ** fetchOne
dbWrapper.fetchOne('SELECT fist_name FROM user ORDER BY rank DESC LIMIT 1', [], function(err, result) {
    if( ! err )
        console.dir(result);
    // "result" is the first_name of our best user
} );

// ** insert   (DBExpr force somes values to be used "as is", without safe escape : it is useful for SQL functions like "NOW()", "COUNT(*)", "SUM(rank)"... )
var JohnData = { first_name: 'John', last_name: 'Foo', rank: '3', date_created: new DBExpr('NOW()') };
dbWrapper.insert('user', JohnData , function(err) {
    if( ! err )
        console.log( 'John ID : ' + dbWrapper.getLastInsertId() );
    // John has been inserted in our table, with its properties safely escaped
} );

// ** update  ( here the fist name is used as a raw String, but the last name is safely escaped )
var JohnDataUpdate = { rank: '1' };
    dbWrapper.update('user', JohnDataUpdate , [ 'first_name=\'John\'', ['last_name=?', 'Foo'] ], function(err) {
    // John is now our best user. Congratulations, John !
} );

// ** remove  ( this time, both values are safely escaped )
dbWrapper.remove('user', [ ['first_name LIKE ?', '%John%'], ['last_name=?', 'Foo'] ] , function(err) {
    // John left at the height of its glory.
} );


// Easy SQL String building
var select = dbWrapper.getSelect()
    .from('user', ['first_name', 'last_name'] )
    .where( 'enabled=1' )
    .where( 'id=?', 10 )
    .where( 'last_name LIKE ?', '%Foo%' )
    .where( 'removal_date=?', null ) // null -> NULL
    .where( 'nickname=?', undefined ) // other falsy-but-not-Numbers values -> empty String
    .order( 'last_name' )
    .limit( 10 );

if( req.params.onlyVerifiedAccounts )
    select.where('verified=1');

console.log( select.assemble() );//outputs the SQL query for debug purpose

// You can retrieve the data of this DBSelect with a "fetch" method...
dbWrapper.fetchAll( select, function(err) {} );

// ..or you can trigger a "fetch" method directly on it !
select.fetchAll( function(err) {} );


// When you have finished working with the database, you can close the connection
dbWrapper.close( function(err) {console.log('Connection closed !');} );
See the unit tests in the "test/" folder for more examples.

*/
