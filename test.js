var request = require('request')

request.get('http://localhost:8080/api/keywords', function(err, res, body) {
  if (err) {
    console.error(err);
  }
  console.log(res.statusCode);
  console.dir(body);
})
