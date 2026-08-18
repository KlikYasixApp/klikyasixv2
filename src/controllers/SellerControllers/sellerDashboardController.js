const db = require("../../database/db_connection");

/**
 * 1. GET SELLER DASHBOARD (/seller)
 * Menampilkan ringkasan statistik (Pendapatan, Pesanan Baru, Produk Aktif)
 * dan 5 pesanan terbaru milik toko seller yang sedang login.
 */
const getDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;
    console.log("-----------------------------------------");
    console.log("🔍 [DEBUG 1] User ID dari Session:", userId);

    // 1. Ambil Store
    const [stores] = await db.query(
      "SELECT id, store_name FROM stores WHERE user_id = ?",
      [userId],
    );

    if (stores.length === 0) {
      console.log("❌ [DEBUG 2] Toko tidak ditemukan untuk User ID ini!");
      return res.status(404).send("Toko tidak ditemukan");
    }

    const storeId = stores[0].id;
    console.log("✅ [DEBUG 2] Found Store ID:", storeId);

    // 2. Query Pesanan Pending
    const [newOrdersResult] = await db.query(
      `SELECT COUNT(*) AS new_orders_count 
       FROM orders 
       WHERE seller_id = ? AND LOWER(status) = 'pending'`,
      [storeId],
    );

    const newOrdersCount = newOrdersResult[0].new_orders_count || 0;
    console.log("📊 [DEBUG 3] Jumlah Pesanan Pending dari DB:", newOrdersCount);

    // 3. Query 5 Pesanan Terbaru
    const [recentOrders] = await db.query(
      `SELECT id, status FROM orders WHERE seller_id = ? ORDER BY id DESC LIMIT 5`,
      [storeId],
    );
    console.log("📦 [DEBUG 4] Data Recent Orders:", recentOrders);
    console.log("-----------------------------------------");

    res.render("pages/Seller/index", {
      title: "Seller Dashboard",
      store: stores[0],
      stats: {
        totalRevenue: 0,
        newOrdersCount: newOrdersCount, // Pastikan dikirim
        totalProducts: 0,
      },
      recentOrders: recentOrders || [],
    });
  } catch (error) {
    console.error("CRITICAL ERROR:", error);
    res.status(500).send("Server Error");
  }
};

/**
 * 2. TOGGLE STATUS TOKO (/seller/toggle-status)
 * Memperbarui status toko (Buka / Tutup) di tabel stores.
 */
const toggleStoreStatus = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const userId = req.session.user.id;

    // Toggle kolom is_open (1 -> 0 atau 0 -> 1)
    await db.query(
      "UPDATE stores SET is_open = NOT is_open WHERE user_id = ?",
      [userId],
    );

    res.redirect("/seller");
  } catch (error) {
    console.error("Error toggling store status:", error);
    res.status(500).send("Gagal mengupdate status toko");
  }
};

module.exports = {
  getDashboard,
  toggleStoreStatus,
};
