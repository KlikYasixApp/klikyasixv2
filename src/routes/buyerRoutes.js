const express = require("express");
const router = express.Router();

const buyerController = require("../controllers/BuyerControllers/buyerController");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");

// 🌐 ROUTE PUBLIK (Bisa diakses tanpa login agar Home/Katalog muncul)
router.get("/", buyerController.getCatalog);

// 🔒 ROUTE PRIVAT (Wajib Login & Role Buyer)
router.use(isAuthenticated, authorizeRole("buyer"));

// Fitur Cart & Checkout
router.get("/carts", buyerController.getCart);
router.post("/carts", buyerController.addToCart);
router.delete("/carts/item/:id", buyerController.removeFromCart);

// Route Checkout
router.get("/checkout", buyerController.getCheckout);
router.post("/checkout", buyerController.processCheckout);

router.get("/orders/:id", buyerController.getOrderDetail);
router.get("/orders/", buyerController.getOrders);

// Route Katalog / Semua Produk
router.get("/products", buyerController.getAllProducts);
router.get("/products/:id", buyerController.getProductDetail);

module.exports = router;
