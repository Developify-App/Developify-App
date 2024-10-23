const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Define a route that handles post for first deposit
router.post('/firstDeposit', accountController.firstDeposit);

// Define a route that handles PUT for  deposit
router.put('/deposit', accountController.deposit);

// Define a route that handles PUT for  withdraw
router.put('/withdraw', accountController.withdraw);



module.exports = router;