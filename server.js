var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var http = require('http');
var io = require('socket.io').listen(80);
var ss = require('socket.io-stream');
var path = require('path');
var data;

// Create an app to serve static file
var app = http.createServer(function(req, res) {
  var stream = fs.createReadStream(__dirname + '/index.html');
  stream.on('error', function(err) {
    res.statusCode = 500;
    res.end(String(err));
  });
  stream.pipe(res);
});

// Start Binary.js server
var server = BinaryServer({
  server: app
});

// Wait for new user connections
server.on('connection', function(client) {
  // Stream an audio as a hello!
  var music = fs.createReadStream(__dirname + '/Windows_7.mp3');

  music.on('data', function(chunk) {
    chunk += chunk;
    client.send(chunk);
    console.log('In data');
  });

  music.on('end', function() {
    console.log('data ended');
    // client.send(music);
  });

  music.on('error', function(err) {
    console.log(err.stack);
  });

});

app.listen(9000);
console.log('HTTP and BinaryJS server started on port 9000 at' + (new Date().toLocaleString().substr(10, 12)));