const db = require("../database/db_connection");

// 1. TAMPILKAN DAFTAR PESANAN
const getOrders = async (req, res) => {
  try {
    const sellerId = req.session.user ? req.session.user.id : null;

    // Ambil daftar pesanan milik seller
    const [orders] = await db.query(
      `SELECT * FROM orders 
       WHERE seller_id = ? 
       ORDER BY created_at DESC`,
      [sellerId],
    );

    // Ambil item detail untuk setiap pesanan
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
      orders,
    });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).send("Gagal memuat pesanan masuk");
  }
};

// 2. UPDATE STATUS PESANAN (Pending -> Processing -> Completed / Cancelled)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const sellerId = req.session.user ? req.session.user.id : null;

    await db.query(
      "UPDATE orders SET status = ? WHERE id = ? AND seller_id = ?",
      [status, orderId, sellerId],
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
