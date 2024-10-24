const express = require('express');
const bodyParser = require('body-parser');

const helloRoutes = require('./routes/helloRoutes');
const investorRoutes = require('./routes/investorRoutes');
const landownerRoutes = require('./routes/landownerRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middleware for parsing JSON datas
app.use(express.json());

// Use the hello routes
app.use('/api', helloRoutes);

// Use investor routes
app.use('/api/investors', investorRoutes);
app.use('/', landownerRoutes);
app.use('/', projectRoutes);

module.exports = app;
