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

router.use(protect);
router.use(authorize("DELIVERY_PARTNER", "ADMIN"));

router.get("/available", getAvailableJobs);

router.get("/active", getActiveJobs);

router.get("/history", getDeliveryHistory);

router.post("/claim/:orderId", claimOrder);
router.patch("/claim/:orderId", claimOrder);

router.patch("/status/:orderId", updateDeliveryStatus);
router.post("/status/:orderId", updateDeliveryStatus);

module.exports = router;
