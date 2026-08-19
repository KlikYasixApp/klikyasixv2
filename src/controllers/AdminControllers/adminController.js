const db = require("../../database/db_connection");
const bcrypt = require("bcryptjs"); // atau sesuaikan dengan library enkripsi password proyek kamu

/**
 * 1. DASHBOARD ADMIN (Statistik Keseluruhan Platform)
 */
const getDashboard = async (req, res) => {
  try {
    const [[{ totalSellers }]] = await db.query(
      "SELECT COUNT(*) as totalSellers FROM users WHERE role = 'seller'",
    );
    const [[{ totalBuyers }]] = await db.query(
      "SELECT COUNT(*) as totalBuyers FROM users WHERE role = 'buyer'",
    );
    const [[{ totalProducts }]] = await db.query(
      "SELECT COUNT(*) as totalProducts FROM products",
    );
    const [[{ totalOrders, totalOmset }]] = await db.query(
      "SELECT COUNT(*) as totalOrders, COALESCE(SUM(total_price), 0) as totalOmset FROM orders WHERE status = 'completed'",
    );

    const [recentOrders] = await db.query(
      `SELECT o.*, s.store_name, u.name as buyer_name 
       FROM orders o 
       LEFT JOIN stores s ON o.store_id = s.id 
       LEFT JOIN users u ON o.buyer_id = u.id 
       ORDER BY o.created_at DESC LIMIT 5`,
    );

    res.render("pages/Admin/index", {
      title: "Dashboard Admin - Klik Yasix",
      stats: {
        totalSellers: totalSellers || 0,
        totalBuyers: totalBuyers || 0,
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalOmset: totalOmset || 0,
      },
      recentOrders: recentOrders || [],
    });
  } catch (error) {
    console.error("Error Admin Dashboard:", error);
    res.status(500).send("Gagal memuat Dashboard Admin.");
  }
};

/**
 * 2. KELOLA SELLER (Daftar Seluruh Seller & Toko)
 */
const getSellers = async (req, res) => {
  try {
    const [sellers] = await db.query(
      `SELECT u.id as user_id, u.name, u.email, u.created_at,
              s.id as store_id, s.store_name, s.is_open,
              (SELECT COUNT(*) FROM products p WHERE p.store_id = s.id OR p.store_id = s.id) as total_products
       FROM users u
       LEFT JOIN stores s ON u.id = s.user_id
       WHERE u.role = 'seller'
       ORDER BY u.id DESC`,
    );

    res.render("pages/Admin/Sellermanage/index", {
      title: "Kelola Seller - Klik Yasix",
      sellers: sellers || [],
    });
  } catch (error) {
    console.error("Error getSellers:", error);
    res.status(500).send("Gagal memuat daftar seller.");
  }
};

/**
 * 3. EDIT SELLER PAGE
 */
const editSellerPage = async (req, res) => {
  try {
    const { id } = req.params; // user_id seller

    const [sellers] = await db.query(
      `SELECT u.id as user_id, u.name, u.email, 
              s.id as store_id, s.store_name, s.is_open 
       FROM users u 
       LEFT JOIN stores s ON u.id = s.user_id 
       WHERE u.id = ? AND u.role = 'seller'`,
      [id],
    );

    if (sellers.length === 0) {
      return res.redirect("/admin/sellers");
    }

    res.render("pages/Admin/Sellermanage/Edit/index", {
      title: "Edit Seller - Klik Yasix",
      seller: sellers[0],
    });
  } catch (error) {
    console.error("Error editSellerPage:", error);
    res.redirect("/admin/sellers");
  }
};

/**
 * 4. UPDATE SELLER
 */
const updateSeller = async (req, res) => {
  try {
    const { id } = req.params; // user_id
    const { name, email, store_name, is_open } = req.body;

    await db.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ? AND role = 'seller'",
      [name, email, id],
    );

    // Update data toko
    await db.query(
      "UPDATE stores SET store_name = ?, is_open = ? WHERE user_id = ?",
      [store_name, is_open === "1" || is_open === "on" ? 1 : 0, id],
    );

    res.redirect("/admin/sellers");
  } catch (error) {
    console.error("Error updateSeller:", error);
    res.status(500).send("Gagal memperbarui data seller.");
  }
};

/**
 * 5. DELETE SELLER
 */
const deleteSeller = async (req, res) => {
  try {
    const { id } = req.params; // user_id

    const [stores] = await db.query("SELECT id FROM stores WHERE user_id = ?", [
      id,
    ]);

    if (stores.length > 0) {
      const storeId = stores[0].id;
      await db.query(
        "DELETE FROM products WHERE store_id = ? OR store_id = ?",
        [storeId, storeId],
      );
      await db.query("DELETE FROM stores WHERE id = ?", [storeId]);
    }

    await db.query("DELETE FROM users WHERE id = ? AND role = 'seller'", [id]);

    res.redirect("/admin/sellers");
  } catch (error) {
    console.error("Error deleteSeller:", error);
    res.status(500).send("Gagal menghapus seller.");
  }
};

/**
 * RENDER FORM TAMBAH SELLER BARU
 */
const renderCreateForm = (req, res) => {
  res.render("pages/Admin/Sellermanage/new", {
    title: "Tambah Seller Baru - Klik Yasix",
    error: null,
  });
};

/**
 * PROSES TAMBAH SELLER & TOKO BARU
 */
const addSeller = async (req, res) => {
  try {
    const { name, email, password, store_name } = req.body;

    // 1. Cek apakah email sudah terdaftar
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.render("pages/Admin/Sellermanage/new", {
        title: "Tambah Seller Baru - Klik Yasix",
        error: "Email sudah terdaftar. Gunakan email lain.",
      });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan User dengan role 'seller'
    const [userResult] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'seller')",
      [name, email, hashedPassword],
    );

    const newUserId = userResult.insertId;

    // 4. Buat Toko Baru untuk Seller Ini
    await db.query(
      "INSERT INTO stores (user_id, store_name, is_open) VALUES (?, ?, 1)",
      [newUserId, store_name],
    );

    res.redirect("/admin/sellers");
  } catch (error) {
    console.error("Error addSeller:", error);
    res.status(500).send("Gagal menambahkan seller baru.");
  }
};

module.exports = {
  getDashboard,
  getSellers,
  editSellerPage,
  updateSeller,
  deleteSeller,
  renderCreateForm,
  addSeller,
};
