// sudo apt-get install libasound2 libasound-dev

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , midi = require('midi')

app.listen(1337);


var input = new midi.input();


console.log("PORT COUNT: ",input.getPortCount())

console.log("PORT 1: ",input.getPortName(1))

input.on('message', function(deltaTime, message) {
  // console.log('m:' + message + ' d:' + deltaTime);
  if(message[0]==176) {
    // M-AUDIO O2 Knobs
    switch(message[1]){
      case 73:
        // 1st
        io.sockets.emit('camera:rotX',message[2])
        break
      case 72:
        // 2nd
        io.sockets.emit('camera:rotY',message[2])
        break         
      case 74:
        // 2nd
        io.sockets.emit('camera:rotZ',message[2])
        break 
      case 5:
        // 5th
        io.sockets.emit('game:rotVel',message[2])
        break     
      case 84:
        // 6th
        io.sockets.emit('game:mvVel',message[2])
        break 
      case 93:
        // 7th
        io.sockets.emit('game:translateVel',message[2])
        break           
    }
  } else if(message[0]==192) {
    // M-AUDIO O2 buttons
    switch(message[1]){
      case 0:
        // 1st
        io.sockets.emit('camera:switchRotX')
        break
      case 1:
        // 2nd
        io.sockets.emit('camera:switchRotY')
        break         
      case 2:
        // 3nd
        io.sockets.emit('camera:switchRotZ')
        break         
    }
  } else if(message[0]==144) {
    // M-AUDIO O2 keys
    switch(message[1]){
      case 48:
        var msg = 'move:switchX'
         if(message[2]!=0){
          io.sockets.emit(msg)
        }
        break  
               
      case 50:
        var msg = 'move:switchY' 
        if(message[2]!=0){
          io.sockets.emit(msg)
        }
        break 
               
      case 52:
        var msg = 'move:switchZ' 
        if(message[2]!=0){
          io.sockets.emit(msg)
        }
        break
    
      case 53:
        var msg = 'move:translateX' 
        if(message[2]!=0){
          io.sockets.emit(msg,1)
        }
        break

      case 54:
        var msg = 'move:translateX' 
        if(message[2]!=0){
          io.sockets.emit(msg,-1)
        }
        break     

      case 55:
        var msg = 'move:translateY' 
        if(message[2]!=0){
          io.sockets.emit(msg,1)
        }
        break  

      case 56:
        var msg = 'move:translateY' 
        if(message[2]!=0){
          io.sockets.emit(msg,-1)
        }
        break     

      case 57:
        var msg = 'move:translateZ' 
        if(message[2]!=0){
          io.sockets.emit(msg,1)
        }
        break                 

      case 58:
        var msg = 'move:translateZ' 
        if(message[2]!=0){
          io.sockets.emit(msg,-1)
        }
        break                  
    }
  }
});

// change input port as needed
input.openPort(1);



function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.set('log level', 1);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('build:cube',function(material){
  	socket.broadcast.emit('build:cube',material);
  })

  socket.on('build:decayCube',function(material,interval,state){
    socket.broadcast.emit('build:decayCube',material,interval,state);
  })

  socket.on('build:undecayCube',function(material,interval,state){
    socket.broadcast.emit('build:undecayCube',material,interval,state);
  })

  socket.on('page:reload',function(){
  	socket.broadcast.emit('page:reload');
  })

  socket.on('camera:rotXDir',function(direction){
    socket.broadcast.emit('camera:rotXDir',direction);
  })
  socket.on('camera:rotYDir',function(direction){
    socket.broadcast.emit('camera:rotYDir',direction);
  })
  socket.on('camera:rotZDir',function(direction){
    socket.broadcast.emit('camera:rotZDir',direction);
  })

  socket.on('camera:cameraGameRotY',function(y){
    socket.broadcast.emit('camera:cameraGameRotY',y);
  })
  
  socket.on('camera:cameraGameRotX',function(x){
    socket.broadcast.emit('camera:cameraGameRotX',x);
  })
  
  socket.on('camera:cameraGameRotZ',function(z){
    socket.broadcast.emit('camera:cameraGameRotZ',z);
  })

  socket.on('pos:x',function(x){
    socket.broadcast.emit('pos:x',x);
  })

  socket.on('pos:y',function(y){
    socket.broadcast.emit('pos:y',y);
  })

  socket.on('pos:z',function(z){
    socket.broadcast.emit('pos:z',z);
  })    


  socket.on('dir:x',function(x){
    socket.broadcast.emit('dir:x',x);
  })

  socket.on('dir:y',function(y){
    socket.broadcast.emit('dir:y',y);
  })

  socket.on('dir:z',function(z){
    socket.broadcast.emit('dir:z',z);
  }) 

  socket.on('rotVel',function(vel){
    socket.broadcast.emit('rotVel',vel);
  }) 

  socket.on('translateVel',function(vel){
    socket.broadcast.emit('translateVel',vel);
  })  

  socket.on('mvVel',function(vel){
    socket.broadcast.emit('mvVel',vel);
  })   


});