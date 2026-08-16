const db = require("../database/db_connection");

const ProductModel = {
  // Ambil semua produk milik seller tertentu
  findBySellerId: async (sellerId) => {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE seller_id = ? ORDER BY id DESC",
      [sellerId],
    );
    return rows;
  },

  create: async (productData) => {
    const { seller_id, name, category, price, stock, description, image } =
      productData;
    const [result] = await db.query(
      "INSERT INTO products (seller_id, name, category, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [seller_id, name, category, price, stock, description || "", image || ""],
    );
    return result.insertId;
  },
};

module.exports = ProductModel;
