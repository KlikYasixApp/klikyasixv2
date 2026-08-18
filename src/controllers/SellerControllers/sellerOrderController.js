const db = require("../../database/db_connection");

// 1. TAMPILKAN DAFTAR PESANAN
const getOrders = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const userId = req.session.user.id; // User ID = 2

    // CARI STORE ID BERDASARKAN USER ID (KUNCI UTAMA)
    const [stores] = await db.query("SELECT id FROM stores WHERE user_id = ?", [
      userId,
    ]);

    if (stores.length === 0) {
      return res.status(404).send("Toko tidak ditemukan.");
    }

    const storeId = stores[0].id; // Store ID = 1

    // QUERY ORDERS MENGGUNAKAN storeId (BUKAN userId)
    const [orders] = await db.query(
      `SELECT * FROM orders 
       WHERE seller_id = ? 
       ORDER BY created_at DESC`,
      [storeId],
    );

    // Ambil Rincian Items Setiap Pesanan
    for (let order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name AS product_name 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id],
      );
      order.items = items;
    }

    res.render("pages/Seller/orders", {
      title: "Pesanan Masuk - Klik Yasix",
      orders: orders || [],
    });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).send("Gagal memuat pesanan masuk");
  }
};

// 2. UPDATE STATUS PESANAN (Pending -> Processing -> Completed / Cancelled)
const updateOrderStatus = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.session.user.id; // User ID = 2

    // 1. CARI STORE ID DARI USER ID LOGIN
    const [stores] = await db.query("SELECT id FROM stores WHERE user_id = ?", [
      userId,
    ]);

    if (stores.length === 0) {
      return res.status(404).send("Toko tidak ditemukan.");
    }

    const storeId = stores[0].id; // Store ID = 1

    // 2. UPDATE PESANAN MENGGUNAKAN storeId DENGAN TEPAT
    const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE id = ? AND seller_id = ?",
      [status, orderId, storeId],
    );

    console.log(
      `✅ Order #${orderId} diupdate menjadi '${status}' (Affected rows: ${result.affectedRows})`,
    );

    res.redirect("/seller/orders");
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send("Gagal mengupdate status pesanan");
  }
};

module.exports = {
  getOrders,
  updateOrderStatus,
};
