require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT;

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

// 🔁 POST: รับข้อมูลจาก Google Apps Script (batch)
app.post('/saveBatch', (req, res) => {
  const records = req.body.data;
  if (!Array.isArray(records)) return res.status(400).send('Invalid data');

  const keys = Object.keys(records[0]);
  const placeholders = keys.map(() => '?').join(', ');
  const sql = `INSERT INTO datacomNT (${keys.join(',')}) VALUES (${placeholders})`;

  connection.beginTransaction(err => {
    if (err) return res.status(500).send('DB error (transaction)');

    const tasks = records.map(record => {
      const values = keys.map(k => record[k]);
      return new Promise((resolve, reject) => {
        connection.query(sql, values, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    Promise.all(tasks)
      .then(() => {
        connection.commit();
        res.send({ success: true, inserted: records.length });
      })
      .catch(e => {
        connection.rollback();
        console.error('❌ Batch insert error:', e.message);
        res.status(500).send('Batch insert failed');
      });
  });
});

// 🔍 GET: ตรวจสุขภาพ API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 🏠 GET: หน้าหลัก
app.get('/', (req, res) => {
  res.send('✅ Server is alive');
});

// 🚀 Start Server
app.listen(port, () => {
  console.log(`🚀 API running at http://localhost:${port}`);
});
