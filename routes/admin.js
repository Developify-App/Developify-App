const express = require('express');
const connection = require('../config/dbConfig');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Route for Admin login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required' });
    }

    // Query to get the Admin by email
    connection.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const user = results[0];

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, admin.password, (err, match) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (!match) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

            // Send the token in the response
            return res.status(200).json({ message: 'Login successful', token });
        });
    });
});

module.exports = router;