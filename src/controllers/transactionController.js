const db = require('../config/dbConfig');

exports.deposit = async (req, res) => {

    let {amount,date } = req.body;
    const currentDate = new Date();
    const curDate = currentDate.toLocaleDateString();
    date = curDate;
    // Insert new investor into the database
    const result = await db.query(
        'INSERT INTO transaction (amount,date) VALUES (?, ?)',
        [amount,date]
    );
    if(amount.length > 0){
        res.json({
            success: false,
            message: "enter amount"
        })
    }else{

        res.json({
            success: true,
            transaction_id,
            result,
            message: "Successfuly deposited "
        })

        }

    }