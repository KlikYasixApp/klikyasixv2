const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../database/db_connection");

// GET: Render Halaman Login
router.get("/login", (req, res) => {
  const warningMessage = req.query.warning || null;
  res.render("pages/Login/index", {
    title: "Login - Klik Yasix",
    layout: false, // 👈 Matikan layout master
    error: warningMessage,
    email: "",
  });
});

// POST: Proses Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.render("pages/Login/index", {
        title: "Login - Klik Yasix",
        layout: false, // 👈 TAMBAHKAN INI agar header tidak ter-render saat email salah
        error: "Email atau password salah!",
        email,
      });
    }

    const user = rows[0];

    // Cek kecocokan password dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("pages/Login/index", {
        title: "Login - Klik Yasix",
        layout: false, // 👈 TAMBAHKAN INI agar header tidak ter-render saat password salah
        error: "Email atau password salah!",
        email,
      });
    }

    // Simpan data user di session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      store_name: user.store_name,
    };

    // Redirect berdasarkan role
    if (user.role === "admin") return res.redirect("/admin");
    if (user.role === "seller") return res.redirect("/seller");
    return res.redirect("/"); // Buyer diarahkan ke homepage
  } catch (err) {
    console.error("Error saat login:", err);
    res.render("pages/Login/index", {
      title: "Login - Klik Yasix",
      layout: false, // 👈 TAMBAHKAN INI juga di penanganan error server
      error: "Terjadi kesalahan server.",
      email,
    });
  }
});

// GET: Proses Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Error logout:", err);
    res.redirect("/login");
  });
});

module.exports = router;
