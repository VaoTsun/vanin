var http = require('http')
var Pool = require('pg').Pool
var pool = new Pool()

http.createServer(function(req, res) {
  pool.query('SELECT $1::text as name', ['brianc'], function(err, result) {
    res.writeHead(200, {'content-type': 'text/html'})
    res.end('Hello from: ' + result.rows[0].name)
  })
})
