var express = require("express")
var cors = require("cors")
const router = express.Router();
var mysql =require('mysql');
const bcrypt = require('bcrypt')
const session = require('express-session');


var mysqlConnection = require('./config/connection');
var app=express()
app.use(express.json())

app.use(cors());

//Registration for investor
router.post('/investor/registration', (req, res) => {
    const { name, surname, email, password, passwordConfirm } = req.body;
   
    if (!strongPass.test(password)) {
       return res.json({
           success: false,
           message: "Please enter a Strong Password"
       });
     }
       mysqlConnection.query('SELECT email FROM investor WHERE email = ?', [email], async (error, results) => {
           if (error) {
              console.log(error);
    }
    if (results.length > 0) {
     return res.json({
     success: false,
     message: "Email already exists."
     });
    } else if (password !== passwordConfirm) {
     return res.json({
     success: false,
     message: "Passwords do not match."
     });
    } else {
     let hashedPassword = await bcrypt.hash(password, 8);
   
     mysqlConnection.query('INSERT INTO admin SET ?', { name: name, surname: surname, email: email, password: hashedPassword }, (error, results) => {
     if (error) {
      console.log(error);
     } else {
      return res.json({
      success: true,
      message: "Successfully registered."
      });
      console.log(results);
     }
     });
    }
    });
   });



//connection for server
app.listen(3001, (err) =>{
    if (err){
        console.log(err);
    }else{
        console.log('Express server is runnig at port no : 3001');
    }
})


//console.log("Test");