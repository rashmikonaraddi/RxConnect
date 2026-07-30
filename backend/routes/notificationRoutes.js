const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// All notification routes require authentication
router.use(protect);

// Issue #47: Fetch in-app notifications
router.get("/", getNotifications);

// Issue #47: Mark notification as read (Supports PATCH and POST)
router.patch("/:id/read", markAsRead);
router.post("/:id/read", markAsRead); // Alias for Postman convenience

module.exports = router;
