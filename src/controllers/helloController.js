const db = require('../config/dbConfig');

exports.sayHello = async (req, res) => {
    try {
        // Query the database for a test
        const [rows] = await db.query('SELECT "Hello from the database" AS message');

        // Send back the result
        res.json({ message: rows[0].message });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database connection failed');
    }
};
