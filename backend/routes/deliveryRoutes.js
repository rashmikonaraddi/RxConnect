const express = require("express");
const router = express.Router();
const {
  getAvailableJobs,
  getActiveJobs,
  getDeliveryHistory,
  claimOrder,
  updateDeliveryStatus,
} = require("../controllers/deliveryController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All delivery endpoints require authentication & DELIVERY_PARTNER or ADMIN role
router.use(protect);
router.use(authorize("DELIVERY_PARTNER", "ADMIN"));

// Available pickup queue
router.get("/available", getAvailableJobs);

// Active assigned deliveries
router.get("/active", getActiveJobs);

// Delivery history & payouts
router.get("/history", getDeliveryHistory);

// Issue #40: Claim an available delivery job
router.post("/claim/:orderId", claimOrder);

// Issue #41: Update delivery status (PACKED -> OUT_FOR_DELIVERY -> DELIVERED)
router.patch("/status/:orderId", updateDeliveryStatus);

module.exports = router;
