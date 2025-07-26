require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT;
const sql = 'INSERT INTO Aom (name, email) VALUES (?, ?)';

console.log("🌍 ENV loaded:", {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  pass: process.env.MYSQL_PASSWORD,
  db: process.env.MYSQL_DB,
  portApp: process.env.PORT
});

app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Failed to connect to MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to MySQL');
  }
});



app.post('/save', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).send('Missing name or email');

  const sql = 'INSERT INTO Aom (name, email) VALUES (?, ?)';
  connection.query(sql, [name, email], (err) => {
    if (err) return res.status(500).send('DB error');
    res.send('✅ Data saved to MySQL');
  });
});

app.listen(port, () => {
  console.log(`🚀 API running at http://localhost:${port}`);
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ✅ ให้แน่ใจว่ามีเพียงอันเดียวเท่านั้น
app.get('/', (req, res) => {
  res.send('✅ Server is alive');
});
