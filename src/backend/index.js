'use strict'

var server = require('./server.js').Server

server(8080).listen(function() {
  console.log('listening');
})
