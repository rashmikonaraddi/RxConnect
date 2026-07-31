const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// Fetch all notifications
router.get("/", getNotifications);

// Create a notification
router.post("/", createNotification);

// Mark all notifications as read
router.patch("/read-all", markAllAsRead);

// Mark a single notification as read
router.patch("/:id/read", markAsRead);

// Alias for Postman convenience
router.post("/:id/read", markAsRead);

module.exports = router;