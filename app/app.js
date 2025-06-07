const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'chatbot_user',
  password: process.env.DB_PASSWORD || 'chatbot_pass',
  database: process.env.DB_NAME || 'chatbot_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Wait for database connection
async function waitForDB() {
  let retries = 30;
  while (retries) {
    try {
      await pool.getConnection();
      console.log('Database connected successfully');
      break;
    } catch (err) {
      retries -= 1;
      console.log(`Waiting for database... ${retries} retries left`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatbot.html'));
});

// Store chat message
app.post('/api/messages', async (req, res) => {
  try {
    const { message, sender } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO messages (message, sender, timestamp) VALUES (?, ?, NOW())',
      [message, sender]
    );
    
    res.json({ 
      success: true, 
      messageId: result.insertId,
      response: `Bot reply to: ${message}`
    });
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get chat history
app.get('/api/messages', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

// Start server
async function startServer() {
  await waitForDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

module.exports = app;