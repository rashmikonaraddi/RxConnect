const express = require("express");
const router = express.Router();
const {
  getInventory,
  restockInventory,
  getLowStockAlerts,
} = require("../controllers/inventoryController");
const { protect } = require("../middleware/authMiddleware");

// Public/Protected inventory routes
router.get("/", getInventory);
router.get("/low-stock", getLowStockAlerts);
router.post("/restock", protect, restockInventory);
router.patch("/restock", protect, restockInventory);

module.exports = router;
