const ProductModel = require("../../models/productModel");

const getProducts = async (req, res) => {
  try {
    const sellerId = req.session.user.id;
    const products = await ProductModel.findBySellerId(sellerId);

    res.render("pages/Seller/Products/index", {
      title: `Kelola Produk - ${res.locals.WEB_TITLE}`,
      products,
    });
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    res.status(500).send("Terjadi kesalahan pada server.");
  }
};

// Render form tambah produk
const renderCreateForm = (req, res) => {
  res.render("pages/Seller/Products/new", {
    title: `Tambah Produk - ${res.locals.WEB_TITLE}`,
    error: null,
  });
};

// Proses simpan produk ke database
const createProduct = async (req, res) => {
  try {
    const sellerId = req.session.user.id;
    const { name, category, price, stock, description } = req.body;

    if (!name || !price || !stock) {
      return res.render("pages/Seller/Products/new", {
        title: `Tambah Produk - ${res.locals.WEB_TITLE}`,
        error: "Nama, harga, dan stok wajib diisi!",
      });
    }

    // 💡 PERBAIKAN: Bersihkan titik/koma format ribuan sebelum diubah ke Number
    const cleanPrice = Number(price.toString().replace(/[^0-9]/g, ""));
    const cleanStock = Number(stock.toString().replace(/[^0-9]/g, ""));

    await ProductModel.create({
      store_id: sellerId,
      name,
      category,
      price: cleanPrice,
      stock: cleanStock,
      description,
    });

    res.redirect("/seller/products");
  } catch (error) {
    console.error("Gagal menambah produk:", error);
    res.status(500).send("Terjadi kesalahan pada server.");
  }
};

module.exports = {
  getProducts,
  renderCreateForm,
  createProduct,
};
