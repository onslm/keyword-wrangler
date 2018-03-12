
'use strict';

var env = require('./env')
var dbOptions = require('../../database.json')[env]
var DBWrapper = require('node-dbi').DBWrapper;

// var dbConnectionConfig = {'path': '/var/tmp/kw-wrangler.test.sqlite'}

// var dbWrapper = new DBWrapper('sqlite3', dbConnectionConfig)

var dbWrapper

if (dbOptions.driver === 'sqlite3') {
  var dbWrapper = new DBWrapper('sqlite3', { 'path': dbOptions.filename })
} else if (dbOptions.driver === 'mysql') {
  dbWrapper = new DBWrapper('mysql', {
    'host': dbOptions.host,
    'user': dbOptions.user,
    'password': dbOptions.password,
    'database': dbOptions.database
  })
} else {
  throw(new Error('No suitable db config found.'))
}


dbWrapper.connect()
module.exports = dbWrapper

/*

CREATE TABLE keyword (id INTEGER PRIMARY KEY, value TEXT, categoryID INTEGER);
'use strict'
var x
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'lud24 myW.tt'
})

// connection.query('CREATE DATABASE taaas', function(err) {
//  if (err) {
//    console.log('Could not vyvorit databazi "test".');
//  }
// });

connection.query('USE taaas', function(err) {
  if (err) {
    console.log('Could not preponout na databazi "test".');
  }
});





connection.query('CREATE TABLE kw1' +
                '(id INT(11) AUTO_INCREMENT, ' +
                ' value VARCHAR(255), ' +
                ' categoryID INT(11),' +
                ' PRIMARY KEY(id))',
  function(err) {
    if (err) {
      console.log('Could not vytvorit tabulku "kw1".');
    }
});



connection.query('INSERT INTO kw1 (value, categoryID) VALUES ("Petr", 6)')
connection.query('INSERT INTO kw1 (value, categoryID) VALUES ("Marie", 3)')
connection.query('INSERT INTO kw1 (value, categoryID) VALUES ("Franta", 1)')


connection.query('SELECT * FROM kw1 ORDER BY id', function(err, results, fields) {
  if (err) throw error
  x = results
  console.log(results[0]);
  results.forEach( (row) => {
  console.log(`${row.value}`) }
  )
})

// console.log(x);

connection.end();
*/
