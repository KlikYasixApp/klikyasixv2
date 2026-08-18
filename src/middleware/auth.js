// Middleware Cek Login
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  // Redirect ke login membawa pesan peringatan
  return res.redirect(
    "/login?warning=Silakan login terlebih dahulu untuk melanjutkan.",
  );
};

// Middleware Cek Role (Admin / Seller)
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect("/login?warning=Silakan login terlebih dahulu.");
    }

    // Normalisasi role dari session (hilangkan spasi dan ubah ke huruf kecil)
    const userRole = String(req.session.user.role || "")
      .trim()
      .toLowerCase();

    // Normalisasi daftar role yang diizinkan ke huruf kecil
    const allowedRoles = roles.map((r) => String(r).trim().toLowerCase());

    // Debugging di terminal (Opsional, untuk memastikan isi session)
    console.log("=== DEBUG AUTHORIZE ROLE ===");
    console.log("User Role dari Session:", `'${userRole}'`);
    console.log("Allowed Roles:", allowedRoles);
    console.log("Is Authorized?:", allowedRoles.includes(userRole));
    console.log("============================");

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .send("403 - Akses Ditolak: Anda tidak memiliki izin.");
    }

    next();
  };
};

module.exports = {
  isAuthenticated,
  authorizeRole,
};
