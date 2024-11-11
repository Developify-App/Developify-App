const express = require('express');
const connection = require('../config/dbConfig');
const router = express.Router();

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

module.exports = router;