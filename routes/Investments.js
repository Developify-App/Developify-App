const express = require('express');
const connection = require('../config/dbConfig');
const router = express.Router();

router.get('/get_invested_project', (req, res) => {

    var sql = `SELECT im.id as invetment_id, invetment_amount, project_id, investor_id, transaction_id, investor_name, investor_surname, investor_image
                FROM investment im, investor i, project p
                WHERE im.investor_id = i.id
                AND p.id = im.project_id
                AND estimated_budget > current_acquired_budget
                GROUP BY i.id`

    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No project investments found" })
        }
    })
})

router.get('/get_invested_investor_by_id/:investor_id', (req, res) => {

    var sql = `SELECT im.id as invetment_id, invetment_amount, project_id, investor_id, transaction_id, investor_name, 
                investor_surname, investor_image, t.transaction_type, DATE_FORMAT(t.transaction_date,'%d-%b-%Y %T') as transaction_date_time, 
                im.transaction_id, DATE_FORMAT(t.transaction_date,'%b %d, %Y ') as transaction_date,p.project_name
                FROM investment im, investor i, project p, transaction t
                WHERE im.investor_id = i.id
                AND t.id = im.transaction_id
                AND p.id = im.project_id
                AND estimated_budget > current_acquired_budget
                AND i.id =  '${req.params.investor_id}';`;

    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No project investments found" })
        }
    })
})

router.get('/get_invested_investor_group_by_id/:investor_id', (req, res) => {

    var sql = `SELECT im.id as invetment_id, FORMAT(sum(invetment_amount),2) as invetment_amount, project_id, investor_id, 
                transaction_id, investor_name, investor_surname, investor_image, t.transaction_type, 
                DATE_FORMAT(t.transaction_date,'%d-%b-%Y %T') as transaction_date, im.transaction_id, 
                p.profile_picture, p.project_name, FORMAT(p.estimated_budget,2) as estimated_budget
                FROM investment im, investor i, project p, transaction t
                WHERE im.investor_id = i.id
                AND t.id = im.transaction_id
                AND p.id = im.project_id
                AND t.transaction_type = 'Invested'
                AND estimated_budget > current_acquired_budget
                AND i.id =  '${req.params.investor_id}'
                GROUP BY p.id;`;

    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No project investments found" })
        }
    })
})

router.post('/investment', (req, res) => {
    const now = new Date();

    // Extract date parts
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
  
    // Extract time parts
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');


    var transaction_type = '';
    var sql_amount_update = ''
    connection.query(`SELECT * 
                    FROM account 
                    WHERE investor_id = '${req.body.investor_id}'
                    AND total_amount > '${req.body.amount}'`, (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            if (req.body.transaction_type === 'Invested') {
                sql_amount_update = `UPDATE account
                                        set total_amount = total_amount - '${req.body.amount}'
                                        WHERE id = '${result[0].id}'`
                transaction_type = 'Invested'
            }
            else {
                sql_amount_update = `UPDATE account
                                        set total_amount = total_amount + '${req.body.amount}'
                                        WHERE id = '${result[0].id}'`
                transaction_type = 'Withdrawal'
            }

            connection.query(sql_amount_update, (err, results) => {
                if (results.affectedRows != 0) {
                    //var date_time = new Date()
                    var date_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
                    console.log(date_time);

                    var sql_transaction = `INSERT INTO transaction(transaction_type, transaction_date, amount, account_id)
                                                                VALUES('${transaction_type}','${date_time}' , '${req.body.amount}', '${result[0].id}')`
                    connection.query(sql_transaction, (error, results) => {
                        if (error) {
                            console.log(error);
                            return;
                        }
                        var trans_id = results.insertId
                        var sql_investment = `INSERT INTO investment(invetment_amount, project_id, investor_id, transaction_id)
                                                                VALUES('${req.body.amount}','${req.body.project_id}','${req.body.investor_id}'  , '${trans_id}')`
                        connection.query(sql_investment, (err, data) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        })
                    })
                    res.send({ message: 'Succesfully '+transaction_type, success: true })
                }
            })

        }
        else {
            res.send({ success: false, message: "You have insufficient amount to invest" })
        }
    })
})


module.exports = router;