const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const methodOverride = require("method-override");
require("dotenv").config();

// Middleware & Router Imports
const { isAuthenticated, authorizeRole } = require("./src/middleware/auth");
const authRoutes = require("./src/routes/auth");
const sellerRoutes = require("./src/routes/sellerRoutes");

// Database Connection
const db = require("./src/database/db_connection");

const app = express();
const WEB_TITLE = process.env.WEB_TITLE || "Klik Yasix";

// ==========================================
// 1. BASIC MIDDLEWARE & BODY PARSER
// ==========================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ==========================================
// 2. SESSION CONFIGURATION
// ==========================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "klik_yasix_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 Hari
  }),
);

// ==========================================
// 3. VIEW ENGINE & EXPRESS EJS LAYOUTS
// ==========================================
app.set("view engine", "ejs");
const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

// Setup Layout Wrapper (ala React)
app.use(expressLayouts);
app.set("layout", "layouts/main"); // Mengarahkan ke views/layouts/main.ejs

// Static Files
app.use(
  "/stylesheet",
  express.static(path.join(__dirname, "views", "stylesheet")),
);
app.use("/scripts", express.static(path.join(__dirname, "views", "scripts")));
app.use("/media", express.static(path.join(__dirname, "source", "media")));
app.use(express.static(path.join(viewsDir)));

// ==========================================
// 4. GLOBAL MIDDLEWARE (User, Title & Seller Status)
// ==========================================
// ==========================================
// GLOBAL MIDDLEWARE (User, Title & Seller Status)
// ==========================================
app.use(async (req, res, next) => {
  // 1. Menyediakan User Session & Title di seluruh View EJS
  res.locals.user = req.session.user || null;
  res.locals.WEB_TITLE = WEB_TITLE;

  // 2. Jika login sebagai Seller, ambil status Toko dari database (pake user_id)
  if (res.locals.user && res.locals.user.role === "seller") {
    try {
      // 💡 Menggunakan user_id sesuai kolom aktual di tabel stores
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

// ==========================================
// 5. MOUNT ROUTERS
// ==========================================

// Auth Routes (/login, /register, /logout)
app.use("/", authRoutes);

// Public Routes
app.get("/", (req, res) => {
  // Jika seller login dan akses /, opsional bisa langsung diarahkan ke Dashboard Seller
  if (res.locals.user && res.locals.user.role === "seller") {
    return res.redirect("/seller");
  }
  res.render("pages/Home/index", {
    title: WEB_TITLE,
    page: "home",
  });
});

app.get("/products", (req, res) => {
  res.render("pages/Products/index", {
    title: `Katalog Produk - ${WEB_TITLE}`,
    page: "menu",
  });
});

// Buyer Protected Routes (Wajib Login)
app.get("/carts", isAuthenticated, (req, res) => {
  res.render("pages/Carts/index", { title: `Keranjang - ${WEB_TITLE}` });
});

app.get("/checkout", isAuthenticated, (req, res) => {
  res.render("pages/Checkout/index", { title: `Checkout - ${WEB_TITLE}` });
});

app.get("/orders", isAuthenticated, (req, res) => {
  res.render("pages/Orders/index", {
    title: `Pesanan Saya - ${WEB_TITLE}`,
    page: "orders",
  });
});

// Admin Protected Routes (Wajib Role Admin)
app.get("/admin", isAuthenticated, authorizeRole("admin"), (req, res) => {
  res.render("pages/Admin/index", { title: `Admin Dashboard - ${WEB_TITLE}` });
});

app.get(
  "/admin/sellers",
  isAuthenticated,
  authorizeRole("admin"),
  (req, res) => {
    res.render("pages/Admin/Sellermanage/index", {
      title: `Kelola Seller - ${WEB_TITLE}`,
    });
  },
);

app.get(
  "/admin/sellers/:id/edit",
  isAuthenticated,
  authorizeRole("admin"),
  (req, res) => {
    res.render("pages/Admin/Sellermanage/Edit/index", {
      title: `Edit Seller - ${WEB_TITLE}`,
    });
  },
);

// Seller Center Routes
app.use("/seller", sellerRoutes);

// ==========================================
// 6. 404 HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).render("pages/404", {
    title: `404 - Halaman Tidak Ditemukan`,
    layout: false, // Bebas tidak memakai layout wrapper untuk 404
  });
});

// ==========================================
// 7. SERVER INITIALIZATION
// ==========================================
const PORT = process.env.WEB_PORT || 3000;
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Klik Yasix Server Running!`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`=================================`);
});
