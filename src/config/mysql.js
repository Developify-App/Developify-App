const mysql = require('mysql2');

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // Replace with your MySQL password
  database: 'developify'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to the MySQL database: developify');
});

module.exports = db;
