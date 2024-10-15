const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/dbConfig');

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, password } = req.body;

    console.log(req.body)
    try {
        // Check if email is already in use
        const [existingLandowner] = await db.query(`SELECT email FROM landonwer WHERE email = ?`, [email]);
        if (existingLandowner.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new landowner into the database
        const result = await db.query(
            `INSERT INTO landonwer (name, surname, email, password) VALUES (?, ?, ?, ?)`,
            [name, surname, email, hashedPassword]
        );

        res.status(201).json({ message: 'landowner registered successfully', landowner_id: result[0].insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
