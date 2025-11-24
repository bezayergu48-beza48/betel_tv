You are correct. Currently, the app is using a Mock API (src/services/mockApi.ts) which only stores data in the browser's memory (RAM). When you refresh the page or restart the server, all new data (like messages) disappears because it is not connected to your real MySQL database yet.
To make it save to your local database permanently, we need to replace the mockApi.ts with a real Backend API (Node.js + Express) that talks to your MySQL database.
Since you are running locally with XAMPP, here is the step-by-step plan to connect your frontend to your real MySQL database:
Phase 1: Create the Backend Server
I will provide the code for a server.js file that you will run alongside your React app. This server will receive the data from your React app and save it to MySQL.
Step 1: Create a new folder for the backend
Inside your betel_tv folder, create a new folder named backend.
Open your terminal, go into this folder: cd backend
Run npm init -y to create a package.json.
Install backend libraries:
code
Bash
npm install express mysql2 cors body-parser dotenv jsonwebtoken bcryptjs multer
Step 2: Create the Server Files
Create a file named server.js inside the backend folder with this code:
File: backend/server.js
code
JavaScript
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
Phase 2: Connect Frontend to Real Backend
Now we need to tell your React app to use this new server instead of the mock data.
Step 1: Update src/services/api.ts
I will create a new service file src/services/realApi.ts (or update mockApi.ts to switch modes). For simplicity, let's modify src/services/mockApi.ts to call the real server for messages.
Update src/services/mockApi.ts:
Find the messages object inside api and replace it with this:
code
TypeScript
// ... existing code ...

  // UPDATED: Real API calls for Messages
  messages: {
    getAll: async (): Promise<ContactMessage[]> => {
      try {
        const response = await fetch('http://localhost:5000/api/messages');
        const data = await response.json();
        // Map DB fields to Frontend types if needed
        return data.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          message: m.message,
          status: m.status,
          date: m.created_at,
          reply: m.reply_content
        }));
      } catch (e) {
        console.error("Failed to fetch messages", e);
        return [];
      }
    },
    create: async (msg: Partial<ContactMessage>) => {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      });
      if (!response.ok) throw new Error('Failed to send');
      return await response.json();
    },
    markAsRead: async (id: number) => {
      // In real app, maybe update status to read
    },
    reply: async (id: number, replyContent: string) => {
      await fetch(`http://localhost:5000/api/messages/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyContent })
      });
    },
    delete: async (id: number) => {
      await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // ... existing code ...
Phase 3: Running Everything
Start XAMPP: Ensure MySQL is running.
Start Backend:
Open a new terminal.
cd backend
node server.js
(You should see "Connected to MySQL Database")
Start Frontend:
Open another terminal.
cd betel_tv
npm run dev
Now, when you send a message from the Contact page, it will be saved in your XAMPP MySQL database and will persist even after you refresh!
Would you like me to generate the full src/services/mockApi.ts update to include these fetch calls?