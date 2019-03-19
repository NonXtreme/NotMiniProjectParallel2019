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
  
    socket.on('message', function(msg){
      //have msg.content msg.username msg.groupname msg.user_ID msg.group_ID

      // get time
      var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

      //inset to table 
      let query = 'INSERT INTO message(content, time_stamp, user_ID, group_ID) VALUES (?,?,?,?)'
      connection.query(query, [msg.content, mysqlTimestamp, msg.user_ID,  msg.group_ID],  function(err,results){
        if(err) throw err
        //if inserted then ok
      })
      //!!!!!!!!!!!!TO-DO will we use groupnaem or group_ID as a socket room????!!!!!!!!!!!!
      io.to(msg.group_ID).emit('message', msg.username + " : " + msg.txt )

        
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
  
