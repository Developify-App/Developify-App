/*const adminService = require('../services/adminService');

const createAdmin = async (req, res) => {
  const { name, email } = req.body;
  try {
    await adminService.addAdmin(name, email);
    res.send('Admin added successfully');
  } catch (error) {
    console.error('Error adding admin:', error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createAdmin
};*/