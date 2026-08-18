const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require("../middleware/auth");

// Controller Imports
const sellerController = require("../controllers/SellerControllers/sellerController");
const sellerProductController = require("../controllers/SellerControllers/sellerProductController");
const sellerOrderController = require("../controllers/SellerControllers/sellerOrderController");
const sellerDashboardController = require("../controllers/SellerControllers/sellerDashboardController");

// KUNCI: Khusus seluruh rute di bawah ini hanya untuk 'seller'
router.use(isAuthenticated, authorizeRole("seller"));

// Route Dashboard Utama Seller (/seller & /seller/toggle-status)
router.get("/", sellerDashboardController.getDashboard);
router.patch("/toggle-status", sellerDashboardController.toggleStoreStatus);

// Order Management (/seller/orders)
router.get("/orders", sellerOrderController.getOrders);
router.patch(
  "/orders/:orderId/status",
  sellerOrderController.updateOrderStatus,
);

// Route Produk (/seller/products)
router.get("/products", sellerController.getProducts);
router.get("/products/new", sellerController.renderCreateForm);
router.post("/products", sellerController.createProduct);

// Route Edit, Delete & Update Produk
router.get("/products/:id/edit", sellerProductController.editProductPage);
router.put("/products/:id", sellerProductController.updateProduct);
router.patch("/products/:id/status", sellerProductController.toggleStatus);
router.delete("/products/:id", sellerProductController.deleteProduct);

module.exports = router;
