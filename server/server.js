const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const config = require('./config/dbconnect')

const connectionPool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: config.database.user,
  password: config.database.password,
  database: 'parallel_db'
})

// function query(sql, params) {
//   connectionPool.getConnection(function (err, connection) {

//     connection.query('START TRANSACTION', function (err, rows) {

//       connection.query(sql, params, (error, results) => {
//         if (error) throw error;
//         console.log(result);
//       });
//     });

//     connection.query('COMMIT', function (err, rows) {
//       connection.release();
//     });

//   });
// }

app.get('/', function (req, res) {
  res.send('hello');
});
app.listen(3000, function (err) {
  if (err) throw err
  console.log('listening on port 3000')
})

io.on('connection', function (socket) {


  socket.on('createGroup', function (data,callback) {
    console.log("Creating group " + data.groupID + " " + data.groupname);
    let query = 'INSERT INTO group_(group_ID,groupname) values(?,?)';


    connectionPool.getConnection(function (err, connection) {
      connection.query('START TRANSACTION', function (err, rows) {
        connection.query(query, [data.groupID, data.groupname], (error, result) => {
          if (error) throw error;
          console.log(result);
          callback({status:"SUCCESS", result:result});
          console.log('create group success!!!');
        });
      });
      connection.query('COMMIT', function (err, rows) {
        connection.release();
      });
    });

    // connection.query(query, [data.groupID, data.groupname], (error, result) => {
    //   if (error) throw error
    //   console.log('create group success!!!');
    // });
  })

  socket.on('login', function (data,callback) {
    console.log("Logging in " + data.userID);
    let query = 'INSERT INTO join_(user_ID,group_ID) values(?,?)';

    connectionPool.getConnection(function (err, connection) {
      connection.query('START TRANSACTION', function (err, rows) {
        connection.query(query, [data.userID], (error, result) => {
          if (error) throw error;
          console.log(result);
          callback({status:"SUCCESS", result:result});
          console.log('Login success!!!');
        });
      });
      connection.query('COMMIT', function (err, rows) {
        connection.release();
      });
    });

    // connection.query(query, [data.userID], (error, result) => {
    //   if (error) throw error
    //   console.log('Login success!!!');
    // });
  })

  socket.on('joinGroup', function (data,callback) {
    console.log("Creating group " + data.userID + " " + data.groupID);
    let query = 'INSERT INTO join_(user_ID,group_ID) values(?,?)';

    connectionPool.getConnection(function (err, connection) {
      connection.query('START TRANSACTION', function (err, rows) {
        connection.query(query, [data.userID, data.groupID], (error, result) => {
          if (error) throw error;
          console.log(result);
          //TODO socket room?
          socket.join(data.groupID);
          callback({status:"SUCCESS", result:result});
          // io.to(data.groupID).emit("joinGroup", data);
          console.log('Join group success!!!');
        });
      });
      connection.query('COMMIT', function (err, rows) {
        connection.release();
      });
    });


    // connection.query(query, [data.userID, data.groupID], (error, result) => {
    //   if (error) throw error
    //   //TODO socket room?
    //   socket.join(data.groupID);
    //   io.to(data.groupID).emit("joinGroup", data);
    //   console.log('Join group success!!!');
    // });
  })

  socket.on('leaveGroup', function (data,callback) {
    console.log("Leaving group " + data.userID + " " + data.groupID);
    let query = 'DELETE FROM join_ WHERE user_ID=? and group_ID=?';

    connectionPool.getConnection(function (err, connection) {
      connection.query('START TRANSACTION', function (err, rows) {
        connection.query(query, [data.userID, data.groupID], (error, result) => {
          if (error) throw error;
          console.log(result);
          //TODO socket room?
          socket.leave(data.groupID);
          callback({status:"SUCCESS", result:result});
          //io.to(data.groupID).emit("leaveGroup", data);
          console.log('Leave group success!!!');
        });
      });
      connection.query('COMMIT', function (err, rows) {
        connection.release();
      });
    });

    // connection.query(query, [data.userID, data.groupID], (error, result) => {
    //   if (error) throw error
    //   //TODO socket room?
    //   io.to(data.groupID).emit("leaveGroup", data);
    //   console.log('Leave group success!!!');
    // });
  })

  socket.on('getAllGroup', function (data,callback) {
    console.log("Getting all groups ");
    let searchResults = [];
    let query = 'select * from group_';

    connectionPool.getConnection(function (err, connection) {
      connection.query('START TRANSACTION', function (err, rows) {
        connection.query(query, [], (error, result) => {
          if (error) throw error;
          console.log(result);
          searchResults = result;
          callback({status:"SUCCESS", result:result});
          console.log('get all group success!!!');
        });
      });
      connection.query('COMMIT', function (err, rows) {
        connection.release();
      });
    });

    // connection.query(query, [data.userID, data.groupID], (error, result) => {
    //   if (error) throw error
    //   searchResults = result;
    //   //TODO socket room?
    //   io.to(data.groupID).emit("getAllGroup", JSON.parse(JSON.stringify(searchResults)));
    //   console.log('get all group success!!!');
    // });
  })

  socket.on('getJoinedGroup', function (data,callback) {
    console.log("Getting groups " + data.userID);
    // let searchResults = [];
    let query = 'select join_.group_ID,group_.groupname from join_,group_ where user_ID=?';

    connectionPool.getConnection(function (err, connection) {
      connection.query('START TRANSACTION', function (err, rows) {
        connection.query(query, [data.userID], (error, result) => {
          if (error) throw error;
          console.log(result);
          // searchResults = result;
          callback({status:"SUCCESS", result:result});
          //TODO socket room?
          // io.to(data.groupID).emit("getJoinedGroup", JSON.parse(JSON.stringify(searchResults)));
          console.log('get joined group success!!!');
        });
      });
      connection.query('COMMIT', function (err, rows) {
        connection.release();
      });
    });


    // connection.query(query, [data.userID], (error, result) => {
    //   if (error) throw error
    //   searchResults = result;
    //   //TODO socket room?
    //   io.to(data.groupID).emit("getJoinedGroup", JSON.parse(JSON.stringify(searchResults)));
    //   console.log('get joined group success!!!');
    // });
  })

  socket.on('sendMessage', function (msg,callback) {
    //have msg.content msg.username msg.groupname msg.userID msg.group_ID

    // get time
    var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    //inset to table 
    let query = 'INSERT INTO message(content, time_stamp, user_ID, group_ID) VALUES (?,?,?,?)'

    connectionPool.getConnection(function (err, connection) {
      connection.query('START TRANSACTION', function (err, rows) {
        connection.query(query, [msg.message, mysqlTimestamp, msg.userID, msg.groupID], (error, result) => {
          if (error) throw error;
          console.log(result);
          callback({status:"SUCCESS", result:result});
          console.log('send message success!!!');
        });
      });
      connection.query('COMMIT', function (err, rows) {
        connection.release();
      });
    });



    // connection.query(query, [msg.message, mysqlTimestamp, msg.userID, msg.groupID], function (err, results) {
    //   if (err) throw err
    //   //if inserted then ok
    // })
    //!!!!!!!!!!!!TO-DO will we use groupnaem or group_ID as a socket room????!!!!!!!!!!!!
    // io.to(msg.groupID).emit('sendMessage', msg.username + " : " + msg.message)


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

