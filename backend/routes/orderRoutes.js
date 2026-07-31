const express = require("express");
const router = express.Router();
const { createOrder, getOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createOrder);
router.get("/", getOrders);

module.exports = router;
