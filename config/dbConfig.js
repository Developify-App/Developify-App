const mysql = require('mysql');

// Create a connection to the database
const db = mysql.createConnection({
  // host: "ls-6adb88b4333d564e74b5950c4f2f563a6a03f724.clio0my02ef4.us-east-1.rds.amazonaws.com",
  // user: "dbmasteruser",
  // password: "!asdA1234",
  // database: "dbmaster",
  // port: "3306"
  host: "localhost",
  user: "root",
  password: "",
  database: "developify",
  port: "3306"
});
 
// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

module.exports = db;