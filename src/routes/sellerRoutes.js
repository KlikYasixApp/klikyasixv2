const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

const sellerProductController = require("../controllers/SellerControllers/sellerProductController");
const sellerOrderController = require("../controllers/SellerControllers/sellerOrderController");
const sellerDashboardController = require("../controllers/SellerControllers/sellerDashboardController");

router.use(isAuthenticated, authorizeRole("seller"));

router.get("/", sellerDashboardController.getDashboard);
router.patch("/toggle-status", sellerDashboardController.toggleStoreStatus);

router.get("/orders", sellerOrderController.getOrders);
router.patch(
  "/orders/:orderId/status",
  sellerOrderController.updateOrderStatus,
);

router.get("/products", sellerProductController.getProducts);
router.get("/products/new", sellerProductController.renderCreateForm);

router.post(
  "/products",
  upload.single("image"),
  sellerProductController.addProduct,
);

router.get("/products/:id/edit", sellerProductController.editProductPage);

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
