const {
  getNotificationsForUser,
  markNotificationAsRead,
} = require("../services/notificationService");

/**
 * @desc    Fetch in-app notifications for the logged-in user (Issue #47)
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const role = req.user ? req.user.role : null;
    const branchId = req.user ? req.user.branchId : null;

    const notifications = await getNotificationsForUser({ userId, role, branchId });
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching notifications.",
      error: error.message,
    });
  }
};

/**
 * @desc    Mark a specific notification as read (Issue #47)
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await markNotificationAsRead(id);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Notification #${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Notification #${id} marked as read.`,
      data: updated,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({
      success: false,
      message: "Server error marking notification as read.",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
