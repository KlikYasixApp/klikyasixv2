const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require("../middleware/auth");
const upload = require("../middleware/upload"); // 💡 Import Middleware Upload Baru

// Controller Imports
const sellerProductController = require("../controllers/SellerControllers/sellerProductController");
const sellerOrderController = require("../controllers/SellerControllers/sellerOrderController");
const sellerDashboardController = require("../controllers/SellerControllers/sellerDashboardController");

// KUNCI: Khusus seluruh rute di bawah ini hanya untuk 'seller'
router.use(isAuthenticated, authorizeRole("seller"));

// 1. Route Dashboard Utama Seller (/seller & /seller/toggle-status)
router.get("/", sellerDashboardController.getDashboard);
router.patch("/toggle-status", sellerDashboardController.toggleStoreStatus);

// 2. Order Management (/seller/orders)
router.get("/orders", sellerOrderController.getOrders);
router.patch(
  "/orders/:orderId/status",
  sellerOrderController.updateOrderStatus,
);

// 3. Route Produk (/seller/products)
router.get("/products", sellerProductController.getProducts);
router.get("/products/new", sellerProductController.renderCreateForm);

// 💡 Tambah Produk Baru dengan Middleware Upload
router.post(
  "/products",
  upload.single("image"),
  sellerProductController.addProduct,
);

// 4. Route Edit, Update & Delete Produk
router.get("/products/:id/edit", sellerProductController.editProductPage);

// 💡 Update Produk dengan Middleware Upload
router.put(
  "/products/:id",
  upload.single("image"),
  sellerProductController.updateProduct,
);
router.post(
  "/products/:id/edit",
  upload.single("image"),
  sellerProductController.updateProduct,
);

router.patch("/products/:id/status", sellerProductController.toggleStatus);
router.post("/products/:id/status", sellerProductController.toggleStatus);

router.delete("/products/:id", sellerProductController.deleteProduct);
router.post("/products/:id/delete", sellerProductController.deleteProduct);

module.exports = router;
