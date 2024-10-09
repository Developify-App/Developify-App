const express = require('express');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Use the user routes
app.use('/v1', userRoutes);

// Use the admin routes
//app.use('/v1', adminRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});