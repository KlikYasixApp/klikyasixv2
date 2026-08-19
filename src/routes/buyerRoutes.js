const express = require("express");
const router = express.Router();

const buyerController = require("../controllers/BuyerControllers/buyerController");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");

router.get("/", buyerController.getCatalog);

router.use(isAuthenticated, authorizeRole("buyer"));

router.get("/carts", buyerController.getCart);
router.post("/carts", buyerController.addToCart);
router.delete("/carts/item/:id", buyerController.removeFromCart);

router.get("/checkout", buyerController.getCheckout);
router.post("/checkout", buyerController.processCheckout);

router.get("/orders/:id", buyerController.getOrderDetail);
router.get("/orders/", buyerController.getOrders);

router.get("/products", buyerController.getAllProducts);
router.get("/products/:id", buyerController.getProductDetail);

module.exports = router;
