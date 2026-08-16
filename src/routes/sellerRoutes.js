const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require("../middleware/auth");
const sellerController = require("../controllers/sellerController");
const sellerProductController = require("../controllers/sellerProductController");
const sellerOrderController = require("../controllers/sellerOrderController");

router.use(isAuthenticated, authorizeRole("seller"));

// Route Dashboard
const sellerDashboardController = require("../controllers/sellerDashboardController");

// Route Utama Dashboard Seller
router.get("/", sellerDashboardController.getDashboard);
router.patch("/toggle-status", sellerDashboardController.toggleStoreStatus);

// Order Management
router.get("/orders", sellerOrderController.getOrders);
router.patch(
  "/orders/:orderId/status",
  sellerOrderController.updateOrderStatus,
);

// Route Produk
router.get("/products", sellerController.getProducts);
router.get("/products/new", sellerController.renderCreateForm);
router.post("/products", sellerController.createProduct);

// Route Edit, Delete & Update Produk
router.get("/products/:id/edit", sellerProductController.editProductPage);
router.put("/products/:id", sellerProductController.updateProduct);
// Route Toggle Status Produk
router.patch("/products/:id/status", sellerProductController.toggleStatus);
router.delete("/products/:id", sellerProductController.deleteProduct);

module.exports = router;

module.exports = router;
