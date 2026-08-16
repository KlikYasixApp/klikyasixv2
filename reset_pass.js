const bcrypt = require("bcryptjs");
const db = require("./src/database/db_connection");

async function resetPasswords() {
  try {
    const adminPass = await bcrypt.hash("admin123", 10);
    const sellerPass = await bcrypt.hash("seller123", 10);
    const buyerPass = await bcrypt.hash("buyer123", 10);

    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      adminPass,
      "admin@kantin.local",
    ]);
    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      sellerPass,
      "seller@kantin.local",
    ]);
    await db.query("UPDATE users SET password = ? WHERE email = ?", [
      buyerPass,
      "buyer@kantin.local",
    ]);

    console.log("✅ Semua password akun demo berhasil di-reset!");
    process.exit();
  } catch (err) {
    console.error("❌ Gagal reset password:", err.message);
    process.exit(1);
  }
}

resetPasswords();
