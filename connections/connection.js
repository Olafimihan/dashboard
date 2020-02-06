var mysql = require('mysql'); 
var util = require('util');

var DataBasepool = mysql.createPool({
    connectionLimit: 1000000, 
    host: "127.0.0.1",
    //    host: "75.127.75.161",
    user: "root",
    password: "opeyemi",
    database: "surveydb" 
});

// Ping database to check for common exception errors.
DataBasepool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.')
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.')
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.')
      }
    }
  
    if (connection) connection.release()
  
    return
})
  
// Promisify for Node.js async/await.
DataBasepool.query = util.promisify(DataBasepool.query)
  

module.exports = DataBasepool;
