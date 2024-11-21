const express = require('express');
const connection = require('../config/dbConfig');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { json } = require('body-parser');


const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null,'public')
    },
    filename: (req, file,cb) => {
        cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
    
})


const uploads = multer({ storage: storage }).array('images');  // Handle multiple files

// Route for uploading images
router.post('/upload-images', (req, res) => {
  uploads(req, res, (err) => {
    if (err) {
      return res.status(500).send({ message: 'Error uploading files' });
    }

const imagePaths = req.files.map((file) => file.path);

    // Insert file paths into the database
    const sql = 'INSERT INTO project_file (file_nane) VALUES ?';
    const values = imagePaths.map((file_nane) => [file_nane]);

    connection.query(sql, [values], (error, results) => {
      if (error) {
        console.error('Error saving to database:', error);
        return res.status(500).send({ message: 'Error saving to database' });
      }

      res.status(200).send({
        message: 'Files uploaded successfully',
        data: results
      });
    });
  });
});


module.exports = router;