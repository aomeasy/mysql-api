require('dotenv').config(); // ✅ เพิ่มบรรทัดนี้

const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ✅ ใช้ค่าจาก .env
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
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

app.get('/', (req, res) => {
  res.send('✅ Server is alive');
});

app.listen(port, () => {
  console.log(`🚀 API running at http://localhost:${port}`);
});

console.log('🔍 Connecting to MySQL with config:');
console.log({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Failed to connect to MySQL:', err.message);
    process.exit(1); // หยุด process เพื่อให้ logs แจ้งชัด
  } else {
    console.log('✅ Connected to MySQL');
  }
});

console.log('🌐 Trying to connect to MySQL at:', {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT
});

app.get('/', (req, res) => {
  res.send('✅ Server is alive');
});
