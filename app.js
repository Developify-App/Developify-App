const express = require('express');
const mysql = require("mysql");
const dotenv = require('dotenv');

dotenv.config({path : './.env'});
const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,  
    database: process.env.DATABASE
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.message);
      return;
    }
    console.log('Connected to the MySQL database: developify');
  });

app.get("/", (req, res) =>{
    res.send("<h1>Home Page<h1>")
});

app.use(express.json());

//Define Router
app.use('/',require('./routes/userRoutes'));
const port = 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });