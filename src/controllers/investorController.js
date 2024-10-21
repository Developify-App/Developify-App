const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/dbConfig');
const randomString = require('randomstring');


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



  exports.reqOTP = async(req, res) => {

    const { email} = req.body;

    const existingInvestor = await db.query('SELECT * FROM investor WHERE email = ?', [email]);

    

      // Generate OTP 
     function generateOTP(){
    return randomString.generate({length: 4,charset: 'numeric'});
    }

    //Store Generated OTP's
  const otpCache = {};

    const otp = generateOTP();
    otpCache  = otp; // Store OTP cache 

    //Send OTP via email
    sendOTP(existingInvestor,otp),
    res.cookie('otpCache', {maxAge :30000, httponly : true});
    res.status(200).json({message : 'OTP sent successfuly'});

//Send OTP via Email
function sendOTP(existingInvestor,otp){

    const mailOptions = {

        from :'Joel@gmail.com',
        to: existingInvestor,
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
            console.log(error);
            res.send({message:'Unable to send the verification', success:false})
        } else {
            console.log('Email sent: ' + info.response);
            res.send({message:'Email sent: ' + info.response, success:true})
        };
    });


};

  }