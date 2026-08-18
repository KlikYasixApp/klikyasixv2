const db = require("../../database/db_connection");

/**
 * Helper internal untuk mengambil store_id milik seller yang sedang login
 */
const getStoreIdByUserId = async (userId) => {
  const [stores] = await db.query("SELECT id FROM stores WHERE user_id = ?", [
    userId,
  ]);
  return stores.length > 0 ? stores[0].id : null;
};

/**
 * 1. GET ALL PRODUCTS (Tampilkan Halaman Produk Seller)
 */
const getProducts = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const userId = req.session.user.id;
    const storeId = await getStoreIdByUserId(userId);

    if (!storeId) {
      return res
        .status(404)
        .send("Toko tidak ditemukan untuk akun seller ini.");
    }

    // Ambil produk berdasarkan store_id ATAU seller_id yang cocok dengan storeId
    const [products] = await db.query(
      "SELECT * FROM products WHERE store_id = ? OR seller_id = ? ORDER BY id DESC",
      [storeId, storeId],
    );

    console.log(
      `📦 [DEBUG GET PRODUCTS] User: ${userId} | Store: ${storeId} | Found: ${products.length} items`,
    );

    res.render("pages/Seller/Products/index", {
      title: "Kelola Produk - Klik Yasix",
      products: products || [],
    });
  } catch (error) {
    console.error("Error getProducts:", error);
    res.status(500).send("Gagal memuat produk.");
  }
};

/**
 * 2. RENDER FORM TAMBAH PRODUK BARU
 */
const renderCreateForm = (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }

  res.render("pages/Seller/Products/new", {
    title: "Tambah Produk Baru - Klik Yasix",
    product: null, // product: null mengindikasikan Mode Tambah
  });
};

/**
 * 3. ADD PRODUCT (Proses Simpan Produk Baru)
 */
const addProduct = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const userId = req.session.user.id;
    const storeId = await getStoreIdByUserId(userId);

    if (!storeId) {
      return res.status(404).send("Toko tidak ditemukan.");
    }

    const { name, category, price, stock, description } = req.body;
    const image = req.file ? req.file.filename : req.body.image || null;

    const cleanPrice = Number(
      price ? price.toString().replace(/[^0-9]/g, "") : 0,
    );
    const cleanStock = Number(
      stock ? stock.toString().replace(/[^0-9]/g, "") : 0,
    );

    // Simpan store_id DAN seller_id dengan storeId (ID Toko)
    await db.query(
      `INSERT INTO products 
       (store_id, seller_id, name, category, price, stock, is_active, image, description) 
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        storeId,
        storeId,
        name,
        category,
        cleanPrice,
        cleanStock || 0,
        image,
        description || "",
      ],
    );

    res.redirect("/seller/products");
  } catch (error) {
    console.error("Error addProduct:", error);
    res.status(500).send("Gagal menambahkan produk.");
  }
};

/**
 * 4. EDIT PRODUCT PAGE (Form Edit Produk)
 */
const editProductPage = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const { id } = req.params;
    const userId = req.session.user.id;
    const storeId = await getStoreIdByUserId(userId);

    // Pastikan produk milik toko seller ini
    const [rows] = await db.query(
      "SELECT * FROM products WHERE id = ? AND (store_id = ? OR seller_id = ?)",
      [id, storeId, storeId],
    );

    if (rows.length === 0) {
      return res.redirect("/seller/products");
    }

    res.render("pages/Seller/Products/new", {
      title: "Edit Produk - Klik Yasix",
      product: rows[0],
    });
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    res.redirect("/seller/products");
  }
};

/**
 * 5. UPDATE PRODUCT (Simpan Perubahan Edit)
 */
const updateProduct = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const { id } = req.params;
    const userId = req.session.user.id;
    const storeId = await getStoreIdByUserId(userId);

    const { name, category, price, stock, description } = req.body;

    const cleanPrice = Number(
      price ? price.toString().replace(/[^0-9]/g, "") : 0,
    );
    const cleanStock = Number(
      stock ? stock.toString().replace(/[^0-9]/g, "") : 0,
    );

    // Ambil data produk lama
    const [oldProduct] = await db.query(
      "SELECT image FROM products WHERE id = ? AND (store_id = ? OR seller_id = ?)",
      [id, storeId, storeId],
    );

    if (oldProduct.length === 0) {
      return res.status(403).send("Anda tidak berhak mengubah produk ini.");
    }

    const image = req.file
      ? req.file.filename
      : req.body.image || oldProduct[0].image;

    await db.query(
      `UPDATE products 
       SET name = ?, category = ?, price = ?, stock = ?, image = ?, description = ? 
       WHERE id = ? AND (store_id = ? OR seller_id = ?)`,
      [
        name,
        category,
        cleanPrice,
        cleanStock,
        image,
        description,
        id,
        storeId,
        storeId,
      ],
    );

    // ✅ FIX: Redirect ke halaman daftar produk setelah update berhasil
    res.redirect("/seller/products");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Gagal memperbarui produk");
  }
};

/**
 * 6. DELETE PRODUCT (Hapus Produk)
 */
const deleteProduct = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const { id } = req.params;
    const userId = req.session.user.id;
    const storeId = await getStoreIdByUserId(userId);

    await db.query(
      "DELETE FROM products WHERE id = ? AND (store_id = ? OR seller_id = ?)",
      [id, storeId, storeId],
    );

    res.redirect("/seller/products");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Gagal menghapus produk");
  }
};

/**
 * 7. TOGGLE PRODUCT STATUS (Aktifkan / Nonaktifkan)
 */
const toggleStatus = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const { id } = req.params;
    const userId = req.session.user.id;
    const storeId = await getStoreIdByUserId(userId);

    await db.query(
      "UPDATE products SET is_active = NOT is_active WHERE id = ? AND (store_id = ? OR seller_id = ?)",
      [id, storeId, storeId],
    );

    res.redirect("/seller/products");
  } catch (error) {
    console.error("Error toggling product status:", error);
    res.status(500).send("Gagal memperbarui status produk");
  }
};

module.exports = {
  getProducts,
  renderCreateForm,
  addProduct,
  editProductPage,
  updateProduct,
  deleteProduct,
  toggleStatus,
};
