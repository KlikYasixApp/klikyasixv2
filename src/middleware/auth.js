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
    if (!req.session.user) {
      return res.redirect("/login?warning=Silakan login terlebih dahulu.");
    }

    if (!roles.includes(req.session.user.role)) {
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
