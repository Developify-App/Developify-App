const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/investor/registration', userController.createUser);

module.exports = router;