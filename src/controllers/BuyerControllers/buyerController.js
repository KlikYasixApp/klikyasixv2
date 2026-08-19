const db = require("../../database/db_connection");

const getCatalog = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, s.store_name 
       FROM products p 
       JOIN stores s ON p.store_id = s.id 
       WHERE s.is_open = 1 AND p.is_active = 1 
       ORDER BY p.id DESC 
       LIMIT 4`,
    );

    res.render("pages/Home/index", {
      title: `Home - ${res.locals.WEB_TITLE}`,
      products: products || [],
    });
  } catch (error) {
    console.error("Error getCatalog:", error);
    res.render("pages/Home/index", {
      title: `Home - ${res.locals.WEB_TITLE}`,
      products: [],
    });
  }
};

const getCart = (req, res) => {
  const cart = req.session.cart || [];

  res.render("pages/Carts/index", {
    title: `Keranjang Belanja - ${res.locals.WEB_TITLE}`,
    carts: cart,
  });
};

const addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const qty = parseInt(quantity, 10) || 1;

  try {
    const [products] = await db.query(
      `SELECT p.*, s.store_name 
       FROM products p 
       JOIN stores s ON p.store_id = s.id 
       WHERE p.id = ? AND s.is_open = 1 AND p.is_active = 1`,
      [product_id],
    );

    if (products.length === 0) {
      return res
        .status(404)
        .send("Produk tidak ditemukan atau toko sedang tutup.");
    }

    const product = products[0];

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const existingIndex = req.session.cart.findIndex(
      (item) => item.id === product.id,
    );

    if (existingIndex > -1) {
      req.session.cart[existingIndex].quantity += qty;
    } else {
      req.session.cart.push({
        id: product.id,
        store_id: product.store_id,
        store_name: product.store_name,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: qty,
      });
    }

    res.redirect("/carts");
  } catch (error) {
    console.error("Error addToCart:", error);
    res.status(500).send("Gagal menambahkan ke keranjang.");
  }
};

const removeFromCart = (req, res) => {
  const productId = parseInt(req.params.id, 10);
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter((item) => item.id !== productId);
  }
  res.redirect("/carts");
};

const getCheckout = (req, res) => {
  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.redirect("/carts");
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  res.render("pages/Checkout/index", {
    title: `Checkout - ${res.locals.WEB_TITLE}`,
    cart,
    totalPrice,
    user: req.session.user || null,
  });
};

const processCheckout = async (req, res) => {
  const cart = req.session.cart || [];
  const { name, table_number, order_type, notes } = req.body;

  const buyer_id = req.session.user ? req.session.user.id : null;
  const customerName =
    name || (req.session.user ? req.session.user.name : "Pembeli");

  if (cart.length === 0) {
    return res.redirect("/carts");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const totalPrice = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    const storeId = cart[0].store_id;

    const [orderResult] = await connection.query(
      `INSERT INTO orders (buyer_id, store_id, customer_name, total_price, status, order_type, table_number, notes) 
       VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [
        buyer_id,
        storeId,
        customerName,
        totalPrice,
        order_type || "dine-in",
        table_number || null,
        notes || "",
      ],
    );

    const orderId = orderResult.insertId;

    const orderItemsData = cart.map((item) => [
      orderId,
      item.id,
      item.quantity,
      item.price,
    ]);

    await connection.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`,
      [orderItemsData],
    );

    await connection.commit();
    req.session.cart = [];
    res.redirect("/orders");
  } catch (error) {
    await connection.rollback();
    console.error("=== ERROR DETAIL CHECKOUT ===");
    console.error("SQL Message:", error.sqlMessage || error.message);
    console.error("==============================");
    res
      .status(500)
      .send(`Gagal memproses pesanan: ${error.sqlMessage || error.message}`);
  } finally {
    connection.release();
  }
};

const getOrders = async (req, res) => {
  const buyer_id = req.session.user ? req.session.user.id : null;
  const newOrderId = req.query.new_order || null;

  try {
    const [orders] = await db.query(
      `SELECT o.*, s.store_name 
       FROM orders o 
       JOIN stores s ON o.store_id = s.id 
       WHERE o.buyer_id = ? OR ? IS NULL
       ORDER BY o.id DESC`,
      [buyer_id, buyer_id],
    );

    for (let order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name AS product_name, p.image 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id],
      );
      order.items = items;
    }

    res.render("pages/Orders/index", {
      title: `Pesanan Saya - ${res.locals.WEB_TITLE}`,
      orders: orders || [],
      newOrderId,
    });
  } catch (error) {
    console.error("Error getOrders:", error);
    res.render("pages/Orders/index", {
      title: `Pesanan Saya - ${res.locals.WEB_TITLE}`,
      orders: [],
      newOrderId: null,
    });
  }
};

const getOrderDetail = async (req, res) => {
  const orderId = req.params.id;

  try {
    const [orders] = await db.query(
      `SELECT o.*, s.store_name 
       FROM orders o 
       JOIN stores s ON o.store_id = s.id 
       WHERE o.id = ?`,
      [orderId],
    );

    if (orders.length === 0) {
      return res.status(404).send("Pesanan tidak ditemukan.");
    }

    const order = orders[0];

    const [items] = await db.query(
      `SELECT oi.*, p.name AS product_name, p.image 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId],
    );

    res.render("pages/Orders/detail", {
      title: `Detail Pesanan #${order.id} - ${res.locals.WEB_TITLE}`,
      order,
      items,
    });
  } catch (error) {
    console.error("Error getOrderDetail:", error);
    res.status(500).send("Gagal mengambil detail pesanan.");
  }
};

const getAllProducts = async (req, res) => {
  const { search } = req.query;

  try {
    let query = `
      SELECT p.*, s.store_name 
      FROM products p 
      JOIN stores s ON p.store_id = s.id 
      WHERE s.is_open = 1 AND p.is_active = 1
    `;
    const queryParams = [];

    if (search) {
      query += ` AND (p.name LIKE ? OR s.store_name LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY p.id DESC`;

    const [products] = await db.query(query, queryParams);

    res.render("pages/Products/index", {
      title: `Semua Produk - ${res.locals.WEB_TITLE}`,
      products: products || [],
      search: search || "",
    });
  } catch (error) {
    console.error("Error getAllProducts:", error);
    res.render("pages/Products/index", {
      title: `Semua Produk - ${res.locals.WEB_TITLE}`,
      products: [],
      search: search || "",
    });
  }
};

const getProductDetail = async (req, res) => {
  const productId = req.params.id;

  try {
    const [products] = await db.query(
      `SELECT p.*, s.store_name, s.is_open 
       FROM products p 
       JOIN stores s ON p.store_id = s.id 
       WHERE p.id = ? AND p.is_active = 1`,
      [productId],
    );

    if (products.length === 0) {
      return res.status(404).render("pages/404", {
        title: `Produk Tidak Ditemukan - ${res.locals.WEB_TITLE}`,
      });
    }

    const product = products[0];

    const [relatedProducts] = await db.query(
      `SELECT p.*, s.store_name 
       FROM products p 
       JOIN stores s ON p.store_id = s.id 
       WHERE p.store_id = ? AND p.id != ? AND p.is_active = 1 AND s.is_open = 1 
       LIMIT 4`,
      [product.store_id, productId],
    );

    res.render("pages/Products/detail", {
      title: `${product.name} - ${res.locals.WEB_TITLE}`,
      product,
      relatedProducts: relatedProducts || [],
    });
  } catch (error) {
    console.error("Error getProductDetail:", error);
    res.status(500).send("Gagal memuat detail produk.");
  }
};

module.exports = {
  getCatalog,
  getCart,
  getAllProducts,
  getProductDetail,
  addToCart,
  removeFromCart,
  getCheckout,
  processCheckout,
  getOrders,
  getOrderDetail,
};
