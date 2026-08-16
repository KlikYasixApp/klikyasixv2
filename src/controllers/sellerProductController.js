const db = require("../database/db_connection");

// Render Halaman Edit Produk
const editProductPage = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.redirect("/seller/products");
    }

    res.render("pages/Seller/Products/new", { product: rows[0] });
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    res.redirect("/seller/products");
  }
};

// Proses Update Produk
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, image, description } = req.body;

    // 💡 Bersihkan titik/koma format ribuan & ubah ke Number
    const cleanPrice = Number(price.toString().replace(/[^0-9]/g, ""));
    const cleanStock = Number(stock.toString().replace(/[^0-9]/g, ""));

    await db.query(
      `UPDATE products 
       SET name = ?, category = ?, price = ?, stock = ?, image = ?, description = ? 
       WHERE id = ?`,
      [name, category, cleanPrice, cleanStock, image, description, id],
    );

    res.redirect("/seller/products");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Gagal memperbarui produk");
  }
};

// Delete
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM products WHERE id = ?", [id]);

    res.redirect("/seller/products");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Gagal menghapus produk");
  }
};

// Control Status
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Membalikkan nilai boolean is_active (1 -> 0, 0 -> 1)
    await db.query(
      "UPDATE products SET is_active = NOT is_active WHERE id = ?",
      [id],
    );

    res.redirect("/seller/products");
  } catch (error) {
    console.error("Error toggling product status:", error);
    res.status(500).send("Gagal memperbarui status produk");
  }
};

module.exports = {
  editProductPage,
  updateProduct,
  deleteProduct,
  toggleStatus,
};
