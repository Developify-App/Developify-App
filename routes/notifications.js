const express = require('express');
const connection = require('../config/dbConfig');
const router = express.Router();


// Route to send a notification
router.post('/notifications', (req, res) => {
    const { investor_id, message } = req.body;
    
    if (!investor_id || !message) {
      return res.status(400).json({ error: 'investor_id and message are required' });
    }
    
    const sql = 'INSERT INTO notifications (investor_id, message) VALUES (?, ?)';
    connection.query(sql, [investor_id, message], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, investor_id, message, status: 'unread' });
    });
  });

  // Route to get notifications for a investor
  router.get('/notifications/:investor_id', (req, res) => {
    const { investor_id } = req.params;
  
    const sql = 'SELECT * FROM notifications WHERE investor_id = ? ORDER BY created_at DESC';
    connection.query(sql, [investor_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  });
  
  // Route to mark notifications as read
  router.put('/notifications/:id', (req, res) => {
    const { id } = req.params;
  
    const sql = 'UPDATE notifications SET status = "read" WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      res.status(200).json({ message: 'Notification marked as read' });
    });
  });


module.exports = router;