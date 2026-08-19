const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../database/db_connection");

router.get("/login", (req, res) => {
  const warningMessage = req.query.warning || null;
  res.render("pages/Login/index", {
    title: "Login - Klik Yasix",
    layout: false,
    error: warningMessage,
    email: "",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.render("pages/Login/index", {
        title: "Login - Klik Yasix",
        layout: false,
        error: "Email atau password salah!",
        email,
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("pages/Login/index", {
        title: "Login - KlikYasix",
        layout: false,
        error: "Email atau password salah!",
        email,
      });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      store_name: user.store_name,
    };

    if (user.role === "admin") return res.redirect("/admin");
    if (user.role === "seller") return res.redirect("/seller");
    return res.redirect("/");
  } catch (err) {
    console.error("Error saat login:", err);
    res.render("pages/Login/index", {
      title: "Login - KlikYasix",
      layout: false,
      error: "Terjadi kesalahan server.",
      email,
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Error logout:", err);
    res.redirect("/login");
  });
});

module.exports = router;
