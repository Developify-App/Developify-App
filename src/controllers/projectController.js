const db = require('../config/dbConfig');

exports.uploadProfilePicture = async (req, res) => {
  try {
    const projectId = req.body.projectId; // Assuming projectId is passed in request body
    const profilePicture = req.file.filename; // File name from multer

    // Update project with the profile picture path in the database
    const [result] = await pool.query('UPDATE project SET profilePicture = ? WHERE id = ?', [profilePicture, projectId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'project not found' });
    }

    res.json({ message: 'Profile picture uploaded successfully', filePath: `/uploads/${profilePicture}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while uploading the profile picture' });
  }
};
