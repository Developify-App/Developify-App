const express = require('express');
const connection = require('../config/dbConfig');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send_otp', (req, res) => {
    var generatedOTP = Math.floor(Math.random() * 90000) + 10000;
    sendEmail(req.body.email, generatedOTP);
    res.send({ message: 'OTP Email sent successfuly', generatedOTP })
})

function sendEmail(email, otp) {
    const mailOptions = {
        from: 'jntokozo195@gmail.com',
        to: email,
        subject: 'OTP Varification',
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

module.exports = router;