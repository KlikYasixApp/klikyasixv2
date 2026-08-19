const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const methodOverride = require("method-override");
require("dotenv").config();

const { isAuthenticated, authorizeRole } = require("./src/middleware/auth");
const authRoutes = require("./src/routes/auth");
const sellerRoutes = require("./src/routes/sellerRoutes");
const buyerRoutes = require("./src/routes/buyerRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const db = require("./src/database/db_connection");

const app = express();
const WEB_TITLE = process.env.WEB_TITLE || "Klik Yasix";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "klik_yasix_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 Hari
  }),
);

app.set("view engine", "ejs");
const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

app.use(expressLayouts);
app.set("layout", "layouts/main"); // Mengarahkan ke views/layouts/main.ejs

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

app.use(
  "/stylesheet",
  express.static(path.join(__dirname, "views", "stylesheet")),
);
app.use("/scripts", express.static(path.join(__dirname, "views", "scripts")));
app.use("/media", express.static(path.join(__dirname, "source", "media")));
app.use(express.static(path.join(viewsDir)));

app.use(async (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.WEB_TITLE = WEB_TITLE;
  res.locals.imageUrl = (image) => {
    if (!image) return null;
    if (/^(https?:)?\/\//i.test(image) || image.startsWith("/")) return image;
    return `/uploads/products/${image}`;
  };

  if (res.locals.user && res.locals.user.role === "seller") {
    try {
      const [stores] = await db.query(
        "SELECT is_open FROM stores WHERE user_id = ?",
        [res.locals.user.id],
      );
      res.locals.sellerData = {
        isOpen: stores.length > 0 ? stores[0].is_open === 1 : true,
      };
    } catch (err) {
      console.error("Error fetching store status for header:", err);
      res.locals.sellerData = { isOpen: true };
    }
  } else {
    res.locals.sellerData = null;
  }

  next();
});

app.use("/", authRoutes);
app.use("/seller", sellerRoutes);
app.use("/admin", adminRoutes);
app.use("/", buyerRoutes);

app.use((req, res, next) => {
  res.status(404).render("pages/404", {
    title: `404 Not Found - ${res.locals.WEB_TITLE || "Klik Yasix"}`,
  });
});

const PORT = process.env.WEB_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Klik Yasix berjalan di http://localhost:${PORT}`);
});
