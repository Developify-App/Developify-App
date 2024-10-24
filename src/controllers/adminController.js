<<<<<<< HEAD
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/dbConfig');



// Function to handle investor signup
exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, password } = req.body;

    try {
        // Check if email is already in use
        const [existingAdmin] = await db.query('SELECT email FROM admin WHERE email = ?', [email]);
        if (existingAdmin.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new investor into the database
        const result = await db.query(
            'INSERT INTO admin (name, surname, email, password) VALUES (?, ?, ?, ?)',
            [name, surname, email, hashedPassword]
        );

        res.status(201).json({ message: 'Admin registered successfully', admin_id: result[0].insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

//Login
exports.login = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const [existingAdmin] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
    
    
      if(existingAdmin.length > 0){

        bcrypt.compare(password, existingAdmin[0].password, (error, response) =>{
            if(error){
                res.json({
                    success: false,
                    message: "error comparing"
                })
            }
            if(response){
            const user = {
  
                admin_id: existingAdmin[0].admin_id,
                 name: existingAdmin[0].name,
                 surname: existingAdmin[0].surname,
                 email: existingAdmin[0].email
            
          }
                res.json({
                    success: true,
                    user,
                    message: "Welcome "+user.name+' '+user.surname
                })
            }else{
                res.json({
                    success: false,
                    message: "password does not match "
                })
            }
        })
     }else{
        res.json({
            success: false,
            message: "email does not exist"
        })
     }
  
};



=======
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/dbConfig');



// Function to handle investor signup
exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, password } = req.body;

    try {
        // Check if email is already in use
        const [existingAdmin] = await db.query('SELECT email FROM admin WHERE email = ?', [email]);
        if (existingAdmin.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new investor into the database
        const result = await db.query(
            'INSERT INTO admin (name, surname, email, password) VALUES (?, ?, ?, ?)',
            [name, surname, email, hashedPassword]
        );

        res.status(201).json({ message: 'Admin registered successfully', admin_id: result[0].insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

//Login
exports.login = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const [existingAdmin] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
    
    
      if(existingAdmin.length > 0){

        bcrypt.compare(password, existingAdmin[0].password, (error, response) =>{
            if(error){
                res.json({
                    success: false,
                    message: "error comparing"
                })
            }
            if(response){
            const user = {
  
                admin_id: existingAdmin[0].admin_id,
                 name: existingAdmin[0].name,
                 surname: existingAdmin[0].surname,
                 email: existingAdmin[0].email
            
          }
                res.json({
                    success: true,
                    user,
                    message: "Welcome "+user.name+' '+user.surname
                })
            }else{
                res.json({
                    success: false,
                    message: "password does not match "
                })
            }
        })
     }else{
        res.json({
            success: false,
            message: "email does not exist"
        })
     }
  
};



>>>>>>> fb5b6ccaa8cbbc78c7bdc8959f9134b105420817
 