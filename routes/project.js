const express = require('express');
const connection = require('../config/dbConfig');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { json } = require('body-parser');

router.get('/get_all_projects', (req, res) => {
    var sql = `SELECT id, project_name,location,FORMAT(estimated_budget,2) as estimated_budget, FORMAT(current_acquired_budget,2) as current_acquired_budget, profile_picture,admin_id
                FROM project WHERE estimated_budget > current_acquired_budget;`;

    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No project(s) found" })
        }
    })
})

router.get('/get_all_my_projects', (req, res) => {
    var sql = `SELECT * FROM project WHERE `;

    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No project(s) found" })
        }
    })
})

router.get('/get_project_images/:projectId', (req, res) => {
    var sql = `SELECT * FROM project WHERE `;

    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No project(s) found" })
        }
    })
})

const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null,'public')
    },
    filename: (req, file,cb) => {
        cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
    
})

const upload = multer ({

  storage: storage  

})

router.post('/upload',upload.single('profile_picture'), (req, res) => {
//console.log(req.file);

const profile_picture = req.file.filename;
const sql = "UPDATE project SET profile_picture = ?";

connection.query(sql,[profile_picture],(err,result) => {

   if(err) return res.json({Message: "Error"});
   return res.json({Status: "Success"});

})

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