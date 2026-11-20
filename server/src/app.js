const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
const db = require('./config/db');

app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS users FROM users');
    res.json({ connected: true, users: rows[0].users });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});
app.use('/api/auth', require('./routes/authRoutes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error('Could not start server:', err.message);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});