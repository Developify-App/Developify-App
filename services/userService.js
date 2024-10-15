const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,  
    database: process.env.DATABASE
  });


const addUser = (name, surname, email, password, passwordConfirm) => {
    /*if (!strongPass.test(password)) {
        return res.json({
          success: false,
          message: "Please enter a Strong Password",
        });
      }*/
      db.query(
        "SELECT email FROM investor WHERE email = ?",
        [email],
        async (error, results) => {
          if (error) {
            console.log(error);
          }
          if (results.length > 0) {
            return res.json({
              success: false,
              message: "Email already exists.",
            });
          } else if (password !== passwordConfirm) {
            return res.json({
              success: false,
              message: "Passwords do not match.",
            });
          } 
            /*let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);*/
    
            db.query(
              "INSERT INTO investor SET ?",
              {
                name: name,
                surname: surname,
                email: email,
                password: password,
              },
              (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  return res.json({
                    success: true,
                    message: "Successfully registered.",
                  });
                  console.log(results);
                }
              }
            );
          
        }
      );
    };

    module.exports = {
        addUser
      };