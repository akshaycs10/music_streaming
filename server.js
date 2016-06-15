var express = require('express'),
 createPlayer = require('web-audio-player'),
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io')({
    transports: ['websocket']
  }).listen(server),
  fs = require('fs')

function handler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html',
  });
  res.end('Hello, world!');
}

app.get('/music', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

// app.get('/music/inside.mp3', function(req, res) {
//   res.sendFile(__dirname + './audio/inside.mp3')
// })

io.sockets.on('connection', function(socket) {
  console.log('connection established');
  
  socket.on('inside', function(filename) {

    var readStream = fs.createReadStream(("./audio/" + filename + ".mp3"), {
      
      'encoding': null
      
    });

    readStream.on('data', function(data) {
      //socket.binaryType = 'arraybuffer';
     console.log(typeof data);
      //console.log('sending chunk of data')
      socket.emit('music', {
        buffer: data
      });
    });

  });

  socket.on('disconnect', function() {
    console.log('connection droped');
  });

});

server.listen(9000, function() {
  console.log('Server started running on port 9000 at ' + (new Date().toLocaleString()));
});