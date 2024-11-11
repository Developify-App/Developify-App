const express = require('express');
const connection = require('../config/dbConfig');
const router = express.Router();

router.get('/get_my_account/:investor_id', (req, res) => {
    var sql = `select format(total_amount,2) as balance from account where investor_id='${req.params.investor_id}'`;
    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            var balance = results[0].balance
            res.send({ success: true, balance })
        }
        else {
            res.send({ success: false, message: "No project investments found" })
        }
    })
})


module.exports = router;