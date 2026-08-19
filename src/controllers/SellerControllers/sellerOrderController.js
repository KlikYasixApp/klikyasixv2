const db = require("../../database/db_connection");

const getOrders = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const userId = req.session.user.id;

    const [stores] = await db.query("SELECT id FROM stores WHERE user_id = ?", [
      userId,
    ]);

    if (stores.length === 0) {
      return res.status(404).send("Toko tidak ditemukan.");
    }

    const storeId = stores[0].id;

    const [orders] = await db.query(
      `SELECT * FROM orders 
       WHERE store_id = ? 
       ORDER BY created_at DESC`,
      [storeId],
    );

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

const updateOrderStatus = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.session.user.id;

    const [stores] = await db.query("SELECT id FROM stores WHERE user_id = ?", [
      userId,
    ]);

    if (stores.length === 0) {
      return res.status(404).send("Toko tidak ditemukan.");
    }

    const storeId = stores[0].id;

    const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE id = ? AND store_id = ?",
      [status, orderId, storeId],
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
