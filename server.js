var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var http = require('http');
var io = require('socket.io').listen(80);
var ss = require('socket.io-stream');
var path = require('path');
var data;

// Create an app to serve static file
var app = http.createServer(function (req, res) {
  var stream = fs.createReadStream(__dirname + '/index.html');
  stream.on('error', function (err) {
    res.statusCode = 500;
    res.end(String(err));
  });
  stream.pipe(res);
});

// Start Binary.js server
var server = BinaryServer({server: app});

// Wait for new user connections
server.on('connection', function(client){
  // Stream an audio as a hello!
  var file = fs.createReadStream(__dirname + '/Windows_7.mp3');
    var file1 = fs.createReadStream(__dirname + '/inside.mp3');
    var file2=fs.createReadStream(__dirname+ '/YJHD-Ghagra.mp3')
  
  file.on('data',function(chunk){
    data+=chunk;
  })
  client.send(file);
   client.send(file1);
});

app.listen(9000);
console.log('HTTP and BinaryJS server started on port 9000 at'+(new Date().toLocaleString().substr(10, 12)));

io.of('/user').on('connection', function(socket) {
  ss(socket).on('profile-image', function(stream, data) {
    var filename = path.basename(data.name);
    stream.pipe(fs.createWriteStream(filename));
  });
});