var mysql = require('mysql');
    port = process.env.PORT || 4205;

if (port === 4205) {
    var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'NonXtreme',
        database: 'parallel_db',
    });
} else {
    console.log("can't connect")
   //same as above, with live server details
}

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = connection;
