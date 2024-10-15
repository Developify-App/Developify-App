const userService = require('../services/userService');

const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    await userService.addUser(name, email);
    res.send('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
    createUser
  };