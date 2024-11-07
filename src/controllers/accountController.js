const db = require('../config/dbConfig');

exports.firstDeposit = async (req, res) => {
    const {total_amount} = req.body;

    // Deposit money and insert into the database
    const result = await db.query(
        'INSERT INTO account (total_amount) VALUES (?)',
        [total_amount]
    );
    
    res.status(201).json({ message: 'Deposited successfully', account_id: result[0].insertId });
} 
exports.deposit = async (req, res) => {
    const account_id =req.params.account_id;
    const amount =req.body.totalAmount;
    

    db.query('UPDATE account SET totalAmount =? WHERE account_id=?',
        [account_id,amount],(err,result)=> {

            if(err){
                console.log(err)
            }else{
                const amount = amount + amount;
                
             res.status(201).json({ message: 'Deposited successfully'});
                
            }

        })

}

exports.withdraw = async (req, res) => {
    const account_id =req.params.account_id;
    const amount =req.body.totalAmount;
    

    db.query('UPDATE account SET totalAmount =? WHERE account_id=?',
        [account_id,amount],(err,result)=> {

            if(err){
                console.log(err)
            }else{
                const amount = amount - amount;
                
             res.status(201).json({ message: 'Withdraw successfully'});
            }

        })

}
