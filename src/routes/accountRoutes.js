<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Define a route that handles post for first deposit
router.post('/firstDeposit', accountController.firstDeposit);

// Define a route that handles PUT for  deposit
router.put('/deposit', accountController.deposit);

// Define a route that handles PUT for  withdraw
router.put('/withdraw', accountController.withdraw);



=======
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Define a route that handles post for first deposit
router.post('/firstDeposit', accountController.firstDeposit);

// Define a route that handles PUT for  deposit
router.put('/deposit', accountController.deposit);

// Define a route that handles PUT for  withdraw
router.put('/withdraw', accountController.withdraw);



>>>>>>> fb5b6ccaa8cbbc78c7bdc8959f9134b105420817
module.exports = router;