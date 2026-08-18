const db = require("../../database/db_connection");

// 1. TAMPILKAN DAFTAR PESANAN
const getOrders = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const userId = req.session.user.id;

    // CARI STORE ID BERDASARKAN USER ID
    const [stores] = await db.query("SELECT id FROM stores WHERE user_id = ?", [
      userId,
    ]);

    if (stores.length === 0) {
      return res.status(404).send("Toko tidak ditemukan.");
    }

    const storeId = stores[0].id;

    // 💡 PERBAIKAN: Gunakan store_id, bukan store_id
    const [orders] = await db.query(
      `SELECT * FROM orders 
       WHERE store_id = ? 
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
    const userId = req.session.user.id;

    // 1. CARI STORE ID DARI USER ID LOGIN
    const [stores] = await db.query("SELECT id FROM stores WHERE user_id = ?", [
      userId,
    ]);

    if (stores.length === 0) {
      return res.status(404).send("Toko tidak ditemukan.");
    }

    const storeId = stores[0].id;

    // 💡 PERBAIKAN: Gunakan store_id, bukan store_id
    const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE id = ? AND store_id = ?",
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
