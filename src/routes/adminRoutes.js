const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require("../middleware/auth");
const adminController = require("../controllers/AdminControllers/adminController");

// KUNCI: Proteksi khusus role admin
router.use(isAuthenticated, authorizeRole("admin"));

// Dashboard Admin
router.get("/", adminController.getDashboard);

// Kelola Seller
router.get("/sellers", adminController.getSellers);
router.get("/sellers/:id/edit", adminController.editSellerPage);
router.post("/sellers/:id/edit", adminController.updateSeller);
router.put("/sellers/:id", adminController.updateSeller);
router.delete("/sellers/:id", adminController.deleteSeller);
router.post("/sellers/:id/delete", adminController.deleteSeller);

// Route Form Tambah Seller (Taruh SEBELUM route dengan parameter :id)
router.get("/sellers/new", adminController.renderCreateForm);
router.post("/sellers", adminController.addSeller);

module.exports = router;
