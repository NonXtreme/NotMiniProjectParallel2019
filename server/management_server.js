
const app = require('express')();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
const mysql = require('mysql');
const config = require('./config/dbconnect');
// const path = require('path');
// const moment = require('moment');
const bodyParser = require('body-parser')

//const port = process.env.PORT || 3000

let port = parseInt(process.argv[2])

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: config.database.user,
  password: config.database.password,
  database: 'parallel_db',
  multipleStatements: true
})

connection.connect()



///////////////////////////////////////////allrooms\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.get('/allrooms', (req, res) => {
  console.log("get all rooom")
  let query = 'select * from group_'
  let id_list = []
  connection.query(query, (err, result) => {
    if(err) throw err
    result.forEach(gname => {
      console.log(gname)
      id_list.push(gname.groupname)
    });
    res.status(200).send(id_list)
  })
})

app.post('/allrooms' , (req, res) => {
  console.log(req.body)
  let gname = req.body.id
  let query1 = `SELECT * FROM group_ WHERE groupname= "${gname}"`
  connection.query(query1, (err, result) => {
    if (err) throw err
    //console.log(result);
    if (result.length != 0) { // romm exist
      res.status(404).json({error:"ROOM_ID already exists"})
      console.log('group already existed!!!');
    } else {
      let query2 = `INSERT INTO group_(groupname) values("${gname}")`;
      connection.query(query2, (err, result) => {
        if (err) throw err
        //console.log(result);
        res.status(201).json({gname})
        console.log('create group success!!!');
      });
    }
  })
})

app.put('/allrooms' , (req, res) => {
  console.log(req.body)
  let gname = req.body.id 
  let query1 = `SELECT * FROM group_ WHERE groupname= "${gname}"`
  connection.query(query1, (err, result) => {
    if (err) throw err
    //console.log(result);
    if (result.length != 0) { // room exist
      console.log(gname);
      res.status(200).json(gname)
      console.log('group already existed!!!');
    } else {
      let query2 = `INSERT INTO group_(groupname) values("${gname}")`;
      connection.query(query2, (err, result) => {
        if (err) throw err
        console.log(gname);
        res.status(201).json(gname)
        console.log('create group success!!!');
      });
    }
  })
})

app.delete('/allrooms' , (req, res) => {
  console.log("DELETEEEEEEEEE")
  //console.log(req.body)
  let gname = req.body.id
  let query1 = `SELECT * FROM group_ WHERE groupname= "${gname}"`
  //console.log(query1)
  connection.query(query1, (err, result) => {
    if (err) throw err
    //console.log(result);
    if (result.length != 0) {
      let query2 = `DELETE FROM join_ WHERE groupname= "${gname}";
                    DELETE FROM group_ WHERE (groupname = "${gname}")`;
      connection.query(query2, (err, result) => {
        if (err) throw err
        //console.log(result);
        res.status(200).json({error: "ROOM_ID Is deleted"})
        console.log('delete group success!!!');
      });
    } else {
      res.status(404).json({error:"Room id is not found"})
      console.log('no group exist!!!');
    }
  })
})

//////////////////////////////////////////room\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get('/room/:id', (req,res) => {
  let gname = req.params.id
  //console.log("getroom ",gname)
  let query1 = `select * from group_ where groupname = "${gname}";`
  let query2 = `SELECT * FROM parallel_db.join_ where groupname = "${gname}";`
  let user_list = []

  connection.query(query1, (err, result) =>{ //check if room exist
    if(err) throw err
    if (result.length != 0){
      connection.query(query2, (err2, result2) =>{ // get all user in room
        //console.log(result2)
        if (result2.length != 0){ // if there is user in room
          result2.forEach(row => {
            console.log("rowwwww " ,row)
            user_list.push(row.username)
          })
        }
        //console.log(user_list)
        console.log(user_list)
        res.status(200).send(user_list)
      })
    }
    else{ //room dont exist
      res.status(404).json({error: "Room does not exist"})
    }
  })
});

//join room
app.post('/room/:id', (req,res) => {

  let gname = req.params.id
  let username = req.body["user"]
  console.log("joinroom ",username, gname)
  let query1 = `select * from group_ where groupname = "${gname}";`
  let query2 = `SELECT * FROM parallel_db.join_ where groupname = "${gname}" and username = "${username}";`

  connection.query(query1, (err, result) =>{ //check if room exist
    if(err) throw err
    if (result.length != 0){
      connection.query(query2, (err2, result2) =>{ // get all user in room
        console.log(result2)
        if (result2.length != 0){ // if this user is already in this room -> do nothing
          res.status(200).send({})
        }
        else{ // this user is not in this room -> join
          let query3 = `INSERT IGNORE INTO user_ (username) VALUES ("${username}");
                        INSERT INTO join_ (username, groupname) VALUES ('${username}', '${gname}');`
          connection.query(query3, (err3, result3) =>{
            if(err3) throw err3
            res.status(201).send({})
          })
        }
      })
    }
    else{ //room dont exist
      res.status(404).json({error: "Room does not exist"})
    }
  })
})

app.put('/room/:id', (req,res) => {

  let gname = req.params.id
  let username = req.body["user"]
  console.log("joinroom ",username, gname)
  let query1 = `select * from group_ where groupname = "${gname}";`
  let query2 = `SELECT * FROM parallel_db.join_ where groupname = "${gname}" and username = "${username}";`

  connection.query(query1, (err, result) =>{ //check if room exist
    if(err) throw err
    if (result.length != 0){
      connection.query(query2, (err2, result2) =>{ // get all user in room
        console.log(result2)
        if (result2.length != 0){ // if this user is already in this room -> do nothing
          res.status(200).send({})
        }
        else{ // this user is not in this room -> join
          let query3 = `INSERT INTO user_ (username) VALUES ("${username}");
                        INSERT INTO join_ (username, groupname) VALUES ('${username}', '${gname}');`
          connection.query(query3, (err3, result3) =>{
            if(err3) throw err3
            res.status(201).send({})
          })
        }
      })
    }
    else{ //room dont exist
      res.status(404).json({error: "Room does not exist"})
    }
  })
})

//leave group
app.delete('/room/:id', (req,res) => {

  let gname = req.params.id
  let username = req.body["user"]
  console.log("joinroom ",username, gname)

  let query1 = `SELECT * FROM parallel_db.join_ where groupname = "${gname}" and username = "${username}";`

  connection.query(query1, (err, result) =>{ //check if user is in room 
    if(err) throw err
    if (result.length != 0){ // user in room
      let query2 = `DELETE FROM join_ WHERE username= "${username}" and groupname= "${gname}"`
      connection.query(query2, (err2, result2) =>{ // delete user from room
        if(err) throw err2
        res.status(200).json({message: "User leaves the room"})
      })
    }
    else{ //user not in room
      console.log
      res.status(404).json({error: `${username} id is not found`})
    }
  })
})

///////////////////////////////////////////users\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.get('/users', (req, res) => {
  console.log("get all rooom")
  let query = 'select * from user_'
  let user_list = []
  connection.query(query, (err, result) => {
    if(err) throw err
    result.forEach(user => {
      console.log(user)
      user_list.push(user.username)
    });
    res.status(200).send(user_list)
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))