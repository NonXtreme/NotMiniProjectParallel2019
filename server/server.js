const cors = require('cors');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const config = require('./config/dbconnect');
const path = require('path');
const connection = mysql.createConnection({
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
  res.sendFile(path.join(__dirname, "../client/page.html"));
});
http.listen(3000, function (err) {
  if (err) throw err
  console.log('listening on port 3000')
})

io.on('connection', function (socket) {


  socket.on('createGroup', function (data, callback) {
    console.log("Creating group " + data.groupName);
    let query1 = 'SELECT * FROM group_ WHERE groupname=?';
    connection.query(query1, [data.groupName], (error, result) => {
      if (error) throw error
      console.log(result);
      if (result.length == 0) {
        let query2 = 'INSERT INTO group_(groupname) values(?)';
        connection.query(query2, [data.groupName], (error, result) => {
          if (error) throw error
          console.log(result);
          callback({ status: "SUCCESS", result: result });
          console.log('create group success!!!');
        });
      } else {
        callback({ status: "SUCCESS", result: result });
        console.log('group already existed!!!');
      }


    });

    //   connectionPool.getConnection(function (err, connection) {
    //     connection.query('START TRANSACTION', function (err, rows) {
    //       connection.query(query, [data.groupName, data.groupname], (error, result) => {
    //         if (error) throw error;
    //         console.log(result);
    //         callback({status:"SUCCESS", result:result});
    //         console.log('create group success!!!');
    //       });
    //     });
    //     connection.query('COMMIT', function (err, rows) {
    //       connection.release();
    //     });
    //   });


  })

  socket.on('login', function (data, callback) {
    console.log("Logging in " + data.userName);
    let query1 = "SELECT * FROM user_ WHERE username=?";

    connection.query(query1, [data.userName], (error, result) => {
      if (error) throw error
      console.log(result);
      if (result.length == 0) {
        let query2 = 'INSERT INTO user_(username) values(?)';
        connection.query(query2, [data.userName], (error, result) => {
          if (error) throw error
          console.log(result);
          callback({ status: "SUCCESS", result: result });
          console.log('Login success!!!');
        });
      } else {
        callback({ status: "SUCCESS", result: result });
        console.log('User already exist and login success!!!');
      }
    });



    // connectionPool.getConnection(function (err, connection) {
    //   onsole.log("Bftrans");
    //   connection.query('START TRANSACTION', function (err, rows) {
    //     connection.query(query, [data.userName], (error, result) => {
    //       if (error) throw error;
    //       console.log(result);
    //       callback({status:"SUCCESS", result:result});
    //       console.log('Login success!!!');
    //     });
    //   });
    //   connection.query('COMMIT', function (err, rows) {
    //     connection.release();
    //   });
    // });


  })

  socket.on('joinGroup', function (data, callback) {
    console.log("Joining group " + data.userName + " " + data.groupName);
    let query = 'INSERT INTO join_(username,groupname) values(?,?)';

    // connectionPool.getConnection(function (err, connection) {
    //   connection.query('START TRANSACTION', function (err, rows) {
    //     connection.query(query, [data.userName, data.groupName], (error, result) => {
    //       if (error) throw error;
    //       console.log(result);
    //       //TODO socket room?
    //       socket.join(data.groupName);
    //       callback({status:"SUCCESS", result:result});
    //       // io.to(data.groupName).emit("joinGroup", data);
    //       console.log('Join group success!!!');
    //     });
    //   });
    //   connection.query('COMMIT', function (err, rows) {
    //     connection.release();
    //   });
    // });

    connection.query(query, [data.userName, data.groupName], (error, result) => {
      if (error) throw error
      console.log(result);
      socket.join(data.groupName);
      callback({ status: "SUCCESS", result: result });
      console.log('Join group success!!!');
    });
  })

  socket.on('leaveGroup', function (data, callback) {
    console.log("Leaving group " + data.userName + " " + data.groupName);
    let query = 'DELETE FROM join_ WHERE username=? and groupname=?';

    // connectionPool.getConnection(function (err, connection) {
    //   connection.query('START TRANSACTION', function (err, rows) {
    //     connection.query(query, [data.userName, data.groupName], (error, result) => {
    //       if (error) throw error;
    //       console.log(result);
    //       //TODO socket room?
    //       socket.leave(data.groupName);
    //       callback({status:"SUCCESS", result:result});
    //       //io.to(data.groupName).emit("leaveGroup", data);
    //       console.log('Leave group success!!!');
    //     });
    //   });
    //   connection.query('COMMIT', function (err, rows) {
    //     connection.release();
    //   });
    // });

    connection.query(query, [data.userName, data.groupName], (error, result) => {
      if (error) throw error
      console.log(result);
      socket.leave(data.groupName);
      callback({ status: "SUCCESS", result: result });
      console.log('Leave group success!!!');
    });
  })

  socket.on('getAllGroup', function (data, callback) {
    console.log("Getting all groups ");
    // let searchResults = [];
    let query = 'select * from group_';

    // connectionPool.getConnection(function (err, connection) {
    //   connection.query('START TRANSACTION', function (err, rows) {
    //     connection.query(query, [], (error, result) => {
    //       if (error) throw error;
    //       console.log(result);
    //       searchResults = result;
    //       callback({status:"SUCCESS", result:result});
    //       console.log('get all group success!!!');
    //     });
    //   });
    //   connection.query('COMMIT', function (err, rows) {
    //     connection.release();
    //   });
    // });

    connection.query(query, [], (error, result) => {
      if (error) throw error
      console.log(result);
      callback({ status: "SUCCESS", result: result });
      console.log('get all group success!!!');
    });
  })

  socket.on('getJoinedGroup', function (data, callback) {
    console.log("Getting joined groups " + data.userName);
    // let searchResults = [];
    let query = 'select join_.groupname from join_ where username=?';

    // connectionPool.getConnection(function (err, connection) {
    //   connection.query('START TRANSACTION', function (err, rows) {
    //     connection.query(query, [data.userName], (error, result) => {
    //       if (error) throw error;
    //       console.log(result);
    //       // searchResults = result;
    //       callback({status:"SUCCESS", result:result});
    //       //TODO socket room?
    //       // io.to(data.groupName).emit("getJoinedGroup", JSON.parse(JSON.stringify(searchResults)));
    //       console.log('get joined group success!!!');
    //     });
    //   });
    //   connection.query('COMMIT', function (err, rows) {
    //     connection.release();
    //   });
    // });


    connection.query(query, [data.userName], (error, result) => {
      if (error) throw error
      console.log(result);
      callback({ status: "SUCCESS", result: result });
      console.log('get joined group success!!!');
    });
  })

  socket.on('sendMessage', function (msg, callback) {
    //have msg.content msg.userName msg.groupname msg.userName msg.group_ID

    // get time
    var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    //inset to table 
    let query = 'INSERT INTO message(content, time_stamp, username, groupname) VALUES (?,?,?,?)'

    // connectionPool.getConnection(function (err, connection) {
    //   connection.query('START TRANSACTION', function (err, rows) {
    //     connection.query(query, [msg.message, mysqlTimestamp, msg.userName, msg.groupName], (error, result) => {
    //       if (error) throw error;
    //       console.log(result);
    //       callback({status:"SUCCESS", result:result});
    //       console.log('send message success!!!');
    //     });
    //   });
    //   connection.query('COMMIT', function (err, rows) {
    //     connection.release();
    //   });
    // });



    connection.query(query, [msg.message, mysqlTimestamp, msg.userName, msg.groupName], function (err, results) {
      if (err) throw err
      //if inserted then ok
      console.log(result);
      callback({ status: "SUCCESS", result: result });
      console.log('send message success!!!');
    })


  })



  socket.on('disconnect', function () {
    console.log('client disconnect...', socket.id)
  })

  socket.on('error', function (err) {
    console.log('received error from client:', socket.id)
    console.log(err)
  })
})

