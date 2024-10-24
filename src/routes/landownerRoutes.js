const express = require('express');
const { body } = require('express-validator');
const landownerController = require('../controllers/landownerController');

const router = express.Router();

/*
Signup
*/
router.post('/signup',
    [
        // Validate and sanitize inputs
        body('name').notEmpty().withMessage('Name is required'),
        body('surname').notEmpty().withMessage('Surname is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        // body('confirmPassword').custom((value, { req }) => {
        //     if (value !== req.body.password) {
        //         throw new Error('Password confirmation does not match password');
        //     }
        //     return true;
        // })
    ],
    landownerController.signup
);

/*
Login
*/
router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    landownerController.login
);

module.exports = router;