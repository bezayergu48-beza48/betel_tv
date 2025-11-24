require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Default XAMPP user
  password: '', // Default XAMPP password is empty
  database: 'betel_tv_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL Database');
  }
});

// --- API ROUTES ---

// 1. Messages API
// Get all messages
app.get('/api/messages', (req, res) => {
  const sql = "SELECT * FROM contact_messages ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create message
app.post('/api/messages', (req, res) => {
  const { name, email, subject, message } = req.body;
  const sql = "INSERT INTO contact_messages (name, email, subject, message, status) VALUES (?, ?, ?, ?, 'unread')";
  db.query(sql, [name, email, subject, message], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, name, email, subject, message, status: 'unread' });
  });
});

// Reply to message
app.post('/api/messages/:id/reply', (req, res) => {
  const { reply } = req.body;
  const { id } = req.params;
  const sql = "UPDATE contact_messages SET reply_content = ?, status = 'replied', replied_at = NOW() WHERE id = ?";
  db.query(sql, [reply, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// Delete message
app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM contact_messages WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});