require("dotenv").config();
const mysql = require("mysql2/promise");

// Buat Connection Pool menggunakan data dari .env
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "klik_yasix",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Tes koneksi saat file diakses
db.getConnection()
  .then((connection) => {
    console.log(`✅ Database ${process.env.DB_NAME} berhasil terhubung!`);
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database gagal terhubung:", err.message);
  });

module.exports = db;
