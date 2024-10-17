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
        const [existingInvestor] = await db.query('SELECT email FROM investor WHERE email = ?', [email]);
        if (existingInvestor.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new investor into the database
        const result = await db.query(
            'INSERT INTO investor (name, surname, email, password) VALUES (?, ?, ?, ?)',
            [name, surname, email, hashedPassword]
        );

        res.status(201).json({ message: 'Investor registered successfully', investor_id: result[0].insertId });
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

    const [existingInvestor] = await db.query('SELECT * FROM investor WHERE email = ?', [email]);
    
    
      if(existingInvestor.length > 0){
        bcrypt.compare(password, existingInvestor[0].password, (error, response) =>{
            if(error){
                res.json({
                    success: false,
                    message: "error comparing"
                })
            }
            if(response){
            const user = {
  
                 investor_id: existingInvestor[0].investor_id,
                 name: existingInvestor[0].name,
                 surname: existingInvestor[0].surname
            
          }
                res.json({
                    success: true,
                    existingInvestor,
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
  
  }