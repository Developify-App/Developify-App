const express = require('express');
const connection = require('../config/dbConfig');
const router = express.Router();

// investor login
router.post('/login', (req, res) => {
    connection.query(`select i.id as investor_id, a.id as account_id, investor_name, investor_name, investor_email, investor_image, investor_password from investor i, account a 
                        WHERE i.id = a.investor_id 
                        AND investor_email = '${req.body.email}'`, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        if (results.length > 0) {
            if (results[0].investor_password === req.body.password) {
                res.send({ message: "successfully logged", success: true, results })
            }
            else {
                res.send({ message: "wrong userrname or password", success: false })
            }
        }
        else {
            res.send({ message: "wrong userrname or password", success: false })
        }
    })
})

// check existing account
router.get('/checkEmail/:email', (req, res) => {
    
    connection.query(`select * from investor where investor_email = '${req.params.email}'`, (error, rows) => {
        if (error) {
            console.log(error);
            return;
        }
        if (rows.length > 0) {
            res.send({ success: false, message: "This account already exist" });
        }
        else {
            res.send({ success: true, message: "This account is not exist, continue" });
        }
    })
})
// investor signup
router.post('/signup', (req, res) => {

    var sql = `insert into investor(investor_name,investor_surname, investor_email,investor_password)
                values(?,?,?,?)`;
    var sqlBody = [req.body.name, req.body.surname, req.body.email, req.body.password];

    connection.query(sql, sqlBody, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }
        if (results.affectedRows != 0) {
            var sql_account = `insert into account(id, total_amount, investor_id)
                                values(?,?,?)`;
            var account_id =Math.floor(Math.random() * 90000) + 10000;
            var investor_id = results.insertId
            var sql_account_body = [account_id,0,investor_id]
            connection.query(sql_account,sql_account_body, (error, rows)=>{
                if (error) {
                    console.log(error);
                    return;
                }
                if(rows.affectedRows != 0){
                    res.send({ success: true, message: "Investor registered successfully" });
                }
                else{
                    res.send({ success: true, message: "You are registered successfully but unable to add account for you please contact the organization so that they can create account for you" });
                }
            })
            
        }
        else {
            res.send({ success: false, message: "Unable to register" });
        }
    })

})

router.get('/get_event', (req, res) => {
    var sql = `SELECT id, event_name, DATE_FORMAT(start_date, "%Y/%m/%d %H:%i") as start_date, DATE_FORMAT(end_date, "%Y/%m/%d %H:%i") as end_date,
                CASE
                        WHEN DATE_FORMAT(CURDATE(), "%Y/%m/%d %H:%i") < DATE_FORMAT(start_date, "%Y/%m/%d %H:%i") THEN 'Upcoming'
                        WHEN DATE_FORMAT(CURDATE(), "%Y/%m/%d %H:%i") BETWEEN DATE_FORMAT(start_date, "%Y/%m/%d %H:%i") AND DATE_FORMAT(end_date, "%Y/%m/%d %H:%i") THEN 'Ongoing'
                        WHEN CURDATE() > DATE_FORMAT(end_date, "%Y/%m/%d %H:%i") THEN 'Past'
                    END AS event_status
                FROM events
                ORDER BY start_date;`;

    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No event(s) found" })
        }
    })
})

router.post('/add_pith_time', (req, res) => {
    var date_time;
    if (req.body.pitch == 'Mid-Day') {
        date_time = new Date(req.body.Date + ' 12:00')
    }
    else {
        date_time = new Date(req.body.Date + ' 00:00')
    }


    var sql = `insert into pitch_time(date_time, pitch)
                values(?,?)`;
    var sqlBody = [date_time, req.body.pitch]
    console.log(sqlBody);

    connection.query(sql, sqlBody, (err, results) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(results);
        if (results.affectedRows != 0) {
            var pitchId = results.insertId
            res.send({ success: true, pitchId: pitchId, message: 'You can add judges' })
        }
        else {
            res.send({ success: false, message: "Unable to create pitch time" })
        }
    })


})

router.post('/add_judge_score_table', (req, res) => {
    var getTeams = `SELECT id, team_name, event_id, team_member
                    FROM team
                    WHERE date_created<  DATE_ADD(CURRENT_DATE, INTERVAL 5 Day);`;

    // Judge insert query
    var password = "Hackasity@2024"
    var sql = `insert into judge(email, name, surname, occupation, contact, event_id, password)
                values(?,?,?,?,?,?,?)`;
    var sqlBody = [req.body.email, req.body.name, req.body.surname, req.body.occupation, req.body.contact, req.body.eventId, password]

    connection.query(getTeams, (error, rows) => {
        if (error) {
            console.log(err)
            return;
        }
        if (rows.length > 0) {
            console.log(rows);
            connection.query(sql, sqlBody, (err, results) => {
                if (err) {
                    console.log(err)
                    return;
                }
                console.log(results);
                if (results.affectedRows != 0) {
                    var judgeId = results.insertId
                    // score insert query
                    var sqlScore = `insert into score(judge, pitch_time, team)
                            values(?,?,?)`;
                    for (var k = 0; k < rows.length; k++) {
                        connection.query(sqlScore, [judgeId, req.body.pitchTimeId, rows[k].id], (err, result) => {
                            if (err) {
                                console.log(err)
                                return;
                            }
                        })
                    }
                    res.send({ success: true, message: 'Judges added' })
                }
                else {
                    res.send({ success: false, message: "Unable to create pitch time" })
                }
            })
        }
    })
})

router.get('/get_judges', (req, res) => {
    var sql = `SELECT DISTINCT email, surname, name, occupation, contact, date_time, pitch
                FROM judge j, score s, pitch_time p
                WHERE j.id = s.judge
                AND s.pitch_time = p.id
                AND DATE_FORMAT(DATE_ADD(date_time,INTERVAL 3 HOUR), "%Y/%m/%d %H:%i") > DATE_FORMAT(CURDATE(), "%Y/%m/%d %H:%i");`;

    //AND DATE_FORMAT(DATE_ADD(date_time,INTERVAL hours HOUR), "%Y/%m/%d %H:%i") < DATE_FORMAT(CURDATE(), "%Y/%m/%d %H:%i")
    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No event(s) found" })
        }
    })
})

router.post('/add_team', (req, res) => {
    var date_time = new Date()

    var sql = `insert into team(team_name, team_member, date_created)
                values(?,?,?)`;
    var sqlBody = [req.body.team_name, req.body.team_member, date_time]
    console.log(date_time);

    connection.query(sql, sqlBody, (err, results) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(results);
        if (results.affectedRows != 0) {
            res.send({ success: true, message: 'Team Added' })
        }
        else {
            res.send({ success: false, message: "Unable to add team" })
        }
    })

})

router.get('/get_teams', (req, res) => {
    var sql = `SELECT id, team_name, event_id, team_member
                FROM team
                WHERE date_created<  DATE_ADD(CURRENT_DATE, INTERVAL 5 Day);`;
    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No event(s) found" })
        }
    })
})

router.put('/assign_team_event/:teamId', (req, res) => {


    var sql = `update team 
                set event_id = ?
                where id = ?`;
    var sql_data = [req.body.event_id, req.params.teamId]
    console.log(sql_data);

    connection.query(sql, sql_data, (err, results) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(results);
        if (results.affectedRows != 0) {
            res.send({ success: true, message: 'Team Added' })
        }
        else {
            res.send({ success: false, message: "Unable to add team" })
        }
    })

})

router.get('/get_teams_by_judge/:judgeId', (req, res) => {
    var sql = `SELECT s.id as score_id, s.id as team_id, team_name, t.event_id, team_member, s.judge as judge_id
                FROM team t, score s
                WHERE t.id = s.team
                AND s.judge = '${req.params.judgeId}'
                AND score IS NULL
                AND date_created<  DATE_ADD(CURRENT_DATE, INTERVAL 5 Day);`;
    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No event(s) found" })
        }
    })
})

router.get('/get_all_score/', (req, res) => {
    var sql = `SELECT s.id as score_id, s.id as team_id, team_name, t.event_id, team_member, s.judge as judge_id, score, novelty,usefulness,feasibility,technical_proficiency,impact,safety,feedback, name, surname
                FROM team t, score s, judge j
                WHERE t.id = s.team
                AND j.id = s.judge
                AND score IS NOT NULL
                AND date_created<  DATE_ADD(CURRENT_DATE, INTERVAL 3 HOUR);`;
    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No event(s) found" })
        }
    })
})

router.get('/get_score/:judgeId', (req, res) => {
    var sql = `SELECT s.id as score_id, s.id as team_id, team_name, t.event_id, team_member, s.judge as judge_id, score, novelty,usefulness,feasibility,technical_proficiency,impact,safety,feedback
                FROM team t, score s
                WHERE t.id = s.team
                AND score IS NOT NULL
                AND s.judge = '${req.params.judgeId}'
                AND date_created<  DATE_ADD(CURRENT_DATE, INTERVAL 5 Day);`;
    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No event(s) found" })
        }
    })
})

router.put('/score_team/:scoreId', (req, res) => {

    var novelty = Number(req.body.novelty) * 0.15;
    var usefulness = Number(req.body.usefulness) * 0.20;
    var feasibility = Number(req.body.feasibility) * 0.15;
    var technical_proficiency = Number(req.body.technical_proficiency) * 0.15;
    var impact = Number(req.body.impact) * 0.25;
    var safety = Number(req.body.safety) * 0.10;

    var total = novelty + usefulness + feasibility + technical_proficiency + impact + safety;
    var score_body = [novelty, usefulness, feasibility, technical_proficiency, impact, safety, total, req.body.feedback, req.params.scoreId];

    var sql = `update score 
    set novelty = ?,
        usefulness = ?,
        feasibility = ?,
        technical_proficiency = ?,
        impact = ?,
        safety = ?,
        score = ?,
        feedback = ?
    where id = ?`;


    connection.query(sql, score_body, (err, results) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log(results);
        if (results.affectedRows != 0) {
            res.send({ success: true, message: 'Scored team succesfully' })
        }
        else {
            res.send({ success: false, message: "Unable to Scored team" })
        }
    })
})

router.get('/get_total_scores', (req, res) => {
    var sql = `SELECT AVG(score) average, s.team, team_name, DATE_FORMAT(DATE_ADD(date_time, INTERVAL 3 HOUR), "%Y/%m/%d %H:%i") as date_time, DATE_FORMAT(CURRENT_TIMESTAMP, "%Y/%m/%d %H:%i") as cur, pitch
            FROM score s, team t, pitch_time p
            where s.team = t.id
            AND p.id = s.pitch_time
            AND DATE_FORMAT(DATE_ADD(date_time, INTERVAL 3 HOUR), "%Y/%m/%d %H:%i") > DATE_FORMAT(CURRENT_TIMESTAMP, "%Y/%m/%d %H:%i")
            GROUP by t.id
            ORDER BY average DESC;`;
    connection.query(sql, (err, results) => {
        if (err) console.log(err)
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: "No event(s) found" })
        }
    })
})


module.exports = router;