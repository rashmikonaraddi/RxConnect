const prisma = require("../config/db");

// @desc Get notifications from Database for logged-in user/role
// @route GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    const items = await prisma.notification.findMany({
      where: {
        OR: [{ userId: userId || undefined }, { role: role || undefined }, { userId: null, role: null }],
      },
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = items.filter((n) => !n.isRead).length;

    return res.json({
      success: true,
      unreadCount,
      count: items.length,
      notifications: items,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Mark single notification as read in Database
// @route PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.json({ success: true, notification: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Mark all notifications as read in Database
// @route PATCH /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;

    const where = {};
    if (userId) {
      where.OR = [{ userId }, { userId: null }];
    }

    await prisma.notification.updateMany({
      where: { ...where, isRead: false },
      data: { isRead: true },
    });

    return res.json({ success: true, message: "All notifications marked as read in database." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Create a notification in Database
// @route POST /api/notifications
const createNotification = async (req, res) => {
  try {
    const { title, message, type, userId, role, branchId, link } = req.body;

    const notif = await prisma.notification.create({
      data: {
        title: title || "New Notification",
        message: message || "",
        type: type || "INFO",
        isRead: false,
        userId: userId || null,
        role: role || null,
        branchId: branchId || null,
        link: link || null,
      },
    });

    return res.status(201).json({ success: true, notification: notif });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
};
