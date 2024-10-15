const express = require('express');
const helloRoutes = require('./routes/helloRoutes');
const investorRoutes = require('./routes/investorRoutes');

const app = express();

// Middleware for parsing JSON data
app.use(express.json());

// Use the hello routes
app.use('/api', helloRoutes);

// Use investor routes
app.use('/api/investors', investorRoutes);

module.exports = app;
