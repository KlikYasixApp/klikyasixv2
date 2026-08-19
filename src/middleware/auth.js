const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect(
    "/login?warning=Silakan login terlebih dahulu untuk melanjutkan.",
  );
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect("/login?warning=Silakan login terlebih dahulu.");
    }

    const userRole = String(req.session.user.role || "")
      .trim()
      .toLowerCase();

    const allowedRoles = roles.map((r) => String(r).trim().toLowerCase());

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
