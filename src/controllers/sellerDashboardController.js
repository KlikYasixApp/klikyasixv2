const db = require("../database/db_connection");

const getDashboard = async (req, res) => {
  try {
    const sellerId = req.session.user ? req.session.user.id : 1;

    // 1. Hitung Total Pendapatan (Hanya pesanan berstatus 'completed')
    const [revenueResult] = await db.query(
      `SELECT SUM(total_price) AS total_revenue 
       FROM orders 
       WHERE seller_id = ? AND status = 'completed'`,
      [sellerId],
    );
    const totalRevenue = revenueResult[0].total_revenue || 0;

    // 2. Hitung Pesanan Baru (Hanya pesanan berstatus 'pending')
    const [newOrdersResult] = await db.query(
      `SELECT COUNT(*) AS new_orders_count 
       FROM orders 
       WHERE seller_id = ? AND status = 'pending'`,
      [sellerId],
    );
    const newOrdersCount = newOrdersResult[0].new_orders_count || 0;

    // 3. Hitung Total Produk Aktif Milik Seller
    const [productsResult] = await db.query(
      `SELECT COUNT(*) AS total_products 
       FROM products 
       WHERE seller_id = ? AND is_active = 1`,
      [sellerId],
    );
    const totalProducts = productsResult[0].total_products || 0;

    // 4. Ambil 5 Pesanan Terbaru untuk Tabel Ringkasan
    const [recentOrders] = await db.query(
      `SELECT id, customer_name, total_price, status, created_at 
       FROM orders 
       WHERE seller_id = ? 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [sellerId],
    );

    res.render("pages/Seller/index", {
      title: "Seller Dashboard - Klik Yasix",
      stats: {
        totalRevenue,
        newOrdersCount,
        totalProducts,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Error loading seller dashboard:", error);
    res.status(500).send("Gagal memuat Seller Dashboard");
  }
};

module.exports = {
  getDashboard,
};

// 2. TOGGLE STATUS TOKO
const toggleStoreStatus = async (req, res) => {
  try {
    const sellerId = req.session.user ? req.session.user.id : null;

    await db.query(
      "UPDATE stores SET is_open = NOT is_open WHERE user_id = ?",
      [sellerId],
    );

    res.redirect("/seller");
  } catch (error) {
    console.error("Error toggling store status:", error);
    res.status(500).send("Gagal mengupdate status toko");
  }
};

// Export semua controller di bagian bawah
module.exports = {
  getDashboard,
  toggleStoreStatus,
};
