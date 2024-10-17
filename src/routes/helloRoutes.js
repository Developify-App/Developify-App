const express = require('express');
const router = express.Router();
const helloController = require('../controllers/helloController');

// Define a route that handles GET requests
router.get('/hello', helloController.sayHello);

module.exports = router;
