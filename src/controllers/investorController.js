<<<<<<< HEAD
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/dbConfig');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');

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

        //res.status(201).json({ message: 'Investor registered successfully', investor_id: result[0].insertId });
        res.json({
            success: true,
            investor_id: result[0].insertId,
            message: "Investor registered successfully "
        })
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
                 surname: existingInvestor[0].surname,
                 email: existingInvestor[0].email
            
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
//Store Generated OTP's and corresponding with email address
let otpCache = {};

 // Generate OTP 
 function generateOTP(){
    return randomString.generate({length: 4,charset: 'numeric'});
    }

    

//Send OTP via Email
function sendOTP(email,otp){
    
    const mailOptions = {

        from :'jntokozo195@gmail.com',
        to: email,
        subject :'OTP Varification',
        text: `Your OTP for vzrification is : ${otp}`
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jntokozo195@gmail.com',
            pass: 'kcdabumoyiwrbpyg'
        }
       
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error occurred: ', error);
            
        } else {
            console.log('OTP Email sent successfuly: ' + info.response);
           
            
        };
    });


};


  exports.reqOTP = async(req, res) => {

    const { email} = req.body;

    
    const otp = generateOTP();
    otpCache [email] = otp; // Store OTP cache 

    //Send OTP via email
    sendOTP(email,otp),
    res.cookie('otpCache',otpCache, {maxAge :30000, httponly : true});
    //res.status(200).json({message : 'OTP sent successfuly and OTP is : ' + otp});
    res.json({
        success: true,
        otp,
        message: "OTP sent successfuly "
    })
console.log(otpCache);


  }

  //Email verify OTP
  exports.verifyOTP = async(req, res) => {

const { email,otp} = req.body;

//check if email exsiting in cache
if(otpCache.email){

    return res.status(400).json({message : 'Email not found'});

}

//Check if OTP matches the one that stored in the cache
if(otpCache[email]== otp){
    //Remove OTP from cache after successful verification
    delete otpCache[email];
    return res.status(200).json({message : 'OTP verified successfully'});

}else{
    return res.status(400).json({message : 'invalid OTP'});
}

=======
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/dbConfig');
const randomString = require('randomstring');
const nodemailer = require('nodemailer');

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

        //res.status(201).json({ message: 'Investor registered successfully', investor_id: result[0].insertId });
        res.json({
            success: true,
            investor_id: result[0].insertId,
            message: "Investor registered successfully "
        })
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
                 surname: existingInvestor[0].surname,
                 email: existingInvestor[0].email
            
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
//Store Generated OTP's and corresponding with email address
let otpCache = {};

 // Generate OTP 
 function generateOTP(){
    return randomString.generate({length: 4,charset: 'numeric'});
    }

    

//Send OTP via Email
function sendOTP(email,otp){
    
    const mailOptions = {

        from :'jntokozo195@gmail.com',
        to: email,
        subject :'OTP Varification',
        text: `Your OTP for vzrification is : ${otp}`
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jntokozo195@gmail.com',
            pass: 'kcdabumoyiwrbpyg'
        }
       
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error occurred: ', error);
            
        } else {
            console.log('OTP Email sent successfuly: ' + info.response);
           
            
        };
    });


};


  exports.reqOTP = async(req, res) => {

    const { email} = req.body;

    
    const otp = generateOTP();
    otpCache [email] = otp; // Store OTP cache 

    //Send OTP via email
    sendOTP(email,otp),
    res.cookie('otpCache',otpCache, {maxAge :30000, httponly : true});
    //res.status(200).json({message : 'OTP sent successfuly and OTP is : ' + otp});
    res.json({
        success: true,
        otp,
        message: "OTP sent successfuly "
    })
console.log(otpCache);


  }

  //Email verify OTP
  exports.verifyOTP = async(req, res) => {

const { email,otp} = req.body;

//check if email exsiting in cache
if(otpCache.email){

    return res.status(400).json({message : 'Email not found'});

}

//Check if OTP matches the one that stored in the cache
if(otpCache[email]== otp){
    //Remove OTP from cache after successful verification
    delete otpCache[email];
    return res.status(200).json({message : 'OTP verified successfully'});

}else{
    return res.status(400).json({message : 'invalid OTP'});
}

>>>>>>> fb5b6ccaa8cbbc78c7bdc8959f9134b105420817
  }