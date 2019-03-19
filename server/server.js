const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const connection = require('./config/dbconnect')

app.get('/', function(req, res){
    res.send("Hello");
});
app.listen(3000, function (err) {
    if (err) throw err
    console.log('listening on port 3000')
  })

io.on('connection', function (socket) {
    socket.on('createGroup',function(){
        
    })
    socket.on('register', function(){
        
    })
  
    socket.on('joinGroup', function(){
        
    })
  
    socket.on('leaveGroup', function(){
        
    })
  
    socket.on('message', function(){
        
    })

  
  
    socket.on('disconnect', function () {
      console.log('client disconnect...', socket.id)
      handleDisconnect()
    })
  
    socket.on('error', function (err) {
      console.log('received error from client:', socket.id)
      console.log(err)
    })
  })
  
