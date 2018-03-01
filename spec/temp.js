var request = require('request')

request.get('http://localhost:8081/api/keywords/', function(err, res, body) {
  console.log(res.statusCode);
})
