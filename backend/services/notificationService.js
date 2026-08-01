const prisma = require("../config/db");

/**
 * Log an in-app notification for a targeted user, role, or branch in Database
 */
const createNotification = async ({ userId = null, role = null, branchId = null, title, message, type = "INFO", link = null }) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: userId || null,
        role: role || null,
        branchId: branchId || null,
        title: title || "New Notification",
        message: message || "",
        type: type || "INFO",
        isRead: false,
        link: link || null,
      },
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification in DB:", error);
    return null;
  }
};

/**
 * Fetch notifications matching user ID, role, or branch ID from Database
 */
const getNotificationsForUser = async ({ userId, role, branchId }) => {
  try {
    const whereOr = [];
    if (userId) whereOr.push({ userId });
    if (role) whereOr.push({ role });
    if (branchId) whereOr.push({ branchId });
    whereOr.push({ userId: null, role: null, branchId: null });

    const notifications = await prisma.notification.findMany({
      where: { OR: whereOr },
      orderBy: { createdAt: "desc" },
    });
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications from DB:", error);
    return [];
  }
};

/**
 * Mark a notification as read in Database
 */
const markNotificationAsRead = async (id) => {
  try {
    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return updated;
  } catch (error) {
    console.error("Error marking notification as read in DB:", error);
    return null;
  }
};

module.exports = {
  createNotification,
  getNotificationsForUser,
  markNotificationAsRead,
};
