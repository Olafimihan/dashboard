var mysql = require('mysql'); 

var DataBasepool = mysql.createPool({
    connectionLimit: 1000000, 
    host: "127.0.0.1",
    //    host: "75.127.75.161",
    user: "root",
    password: "opeyemi",
    database: "surveydb" 
});

module.exports = DataBasepool;
