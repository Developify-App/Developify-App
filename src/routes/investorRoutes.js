const express = require('express');
const { body } = require('express-validator');
const investorController = require('../controllers/investorController');

const router = express.Router();

// Investor signup route
router.post('/signup',
    [
        // Validate and sanitize inputs
        body('name').notEmpty().withMessage('Name is required'),
        body('surname').notEmpty().withMessage('Surname is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
    ],
    investorController.signup
);

module.exports = router;
