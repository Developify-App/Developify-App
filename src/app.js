
const express = require('express');
const helloRoutes = require('./routes/helloRoutes');
const investorRoutes = require('./routes/investorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Middleware for parsing JSON data
app.use(express.json());

// Use the hello routes
app.use('/api', helloRoutes);

// Use investor routes
app.use('/api/investors', investorRoutes);

// Use admin routes
app.use('/api/admin', adminRoutes);

// Use account routes
app.use('/api/account', accountRoutes);

// Use transaction routes
app.use('/api/transaction', transactionRoutes);

module.exports = app;

