const express = require('express');

const transactionController = require('../controllers/transactionController');
const router = express.Router();

// Define a route that handles PUT for  deposit
router.post('/deposit', transactionController.deposit);

module.exports = router;