const db = require("../../database/db_connection");

/**
 * 1. GET SELLER DASHBOARD (/seller)
 * Menampilkan ringkasan statistik dan pesanan terbaru milik toko.
 */
const getDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // 1. Ambil Store berdasarkan User ID
    const [stores] = await db.query(
      "SELECT id, store_name FROM stores WHERE user_id = ?",
      [userId],
    );

    if (stores.length === 0) {
      return res.status(404).send("Toko tidak ditemukan");
    }

    const storeId = stores[0].id;

    // 2. Query Pesanan Pending (💡 PERBAIKAN: Gunakan store_id, bukan seller_id)
    const [newOrdersResult] = await db.query(
      `SELECT COUNT(*) AS new_orders_count 
       FROM orders 
       WHERE store_id = ? AND LOWER(status) = 'pending'`,
      [storeId],
    );

    const newOrdersCount = newOrdersResult[0].new_orders_count || 0;

    // 3. Query 5 Pesanan Terbaru (💡 PERBAIKAN: Gunakan store_id, bukan seller_id)
    const [recentOrders] = await db.query(
      `SELECT id, status FROM orders WHERE store_id = ? ORDER BY id DESC LIMIT 5`,
      [storeId],
    );

    res.render("pages/Seller/index", {
      title: "Seller Dashboard",
      store: stores[0],
      stats: {
        totalRevenue: 0,
        newOrdersCount: newOrdersCount,
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
 */
const toggleStoreStatus = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const userId = req.session.user.id;

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
