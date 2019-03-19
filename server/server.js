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
  socket.on('createGroup',function(data){
    console.log("Creating group "+data.group_ID+" "+data.groupname);
    let query = 'INSERT INTO group_(group_ID,groupname) values(?,?)';
    connection.query(query, [data.group_ID,data.groupname], (error, result) => {
        if (error) throw error
        console.log('create group success!!!');
    });
})
    socket.on('register', function(){
        
    })
  
    socket.on('joinGroup', function(data){
      console.log("Creating group "+data.user_ID+" "+data.group_ID);
      let query = 'INSERT INTO join_(user_ID,group_ID) values(?,?)';
      connection.query(query, [data.user_ID,data.group_ID], (error, result) => {
          if (error) throw error
          //TODO socket room?
          io.to(data.group_ID).emit("groupJoined",data);
          console.log('Join group success!!!');
      });
  })
  
    socket.on('leaveGroup', function(data){
      console.log("Leaving group "+data.user_ID+" "+data.group_ID);
      let query = 'DELETE FROM join_ WHERE user_ID=? and group_ID=?';
      connection.query(query, [data.user_ID,data.group_ID], (error, result) => {
          if (error) throw error
          //TODO socket room?
          io.to(data.group_ID).emit("groupLeft",data);
          console.log('Leave group success!!!');
      });
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
  
