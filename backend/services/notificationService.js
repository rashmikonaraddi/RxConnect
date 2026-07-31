const prisma = require("../config/db");

// In-memory notifications store for instant dev mode fallback
let mockNotifications = [
  {
    id: "notif-001",
    userId: "usr-001", // Emily Watson (Customer)
    role: "CUSTOMER",
    branchId: "br-101",
    title: "Order Out for Delivery",
    message: "Your prescription order #ord-1048 is out for delivery with Rahul Verma.",
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
  },
  {
    id: "notif-002",
    userId: "usr-001",
    role: "CUSTOMER",
    branchId: "br-101",
    title: "Order Verified & Packed",
    message: "Your prescription order #ord-1048 has been verified by Pharmacist Dr. Sarah Jenkins.",
    isRead: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "notif-003",
    userId: null,
    role: "ADMIN",
    branchId: "br-102",
    title: "Low Stock Alert: Metformin 500mg",
    message: "MetroCare Pharmacy - Westside stock level (4 units) dropped below safety threshold (20 units).",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
  },
  {
    id: "notif-004",
    userId: null,
    role: "PHARMACIST",
    branchId: "br-101",
    title: "New Prescription Uploaded",
    message: "New prescription uploaded by customer Emily Watson requires pharmacist verification.",
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
  },
];

/**
 * Log an in-app notification for a targeted user, role, or branch
 */
const createNotification = async ({ userId = null, role = null, branchId = null, title, message }) => {
  try {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          role,
          branchId,
          title,
          message,
          isRead: false,
        },
      });
      return notification;
    } catch (dbErr) {
      const newNotif = {
        id: `notif-${Date.now().toString().slice(-4)}`,
        userId,
        role,
        branchId,
        title,
        message,
        isRead: false,
        createdAt: new Date(),
      };
      mockNotifications.unshift(newNotif);
      return newNotif;
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

/**
 * Fetch notifications matching user ID, role, or branch ID
 */
const getNotificationsForUser = async ({ userId, role, branchId }) => {
  try {
    try {
      const whereOr = [];
      if (userId) whereOr.push({ userId });
      if (role) whereOr.push({ role });
      if (branchId) whereOr.push({ branchId });

      const notifications = await prisma.notification.findMany({
        where: whereOr.length > 0 ? { OR: whereOr } : {},
        orderBy: { createdAt: "desc" },
      });
      return notifications;
    } catch (dbErr) {
      let filtered = mockNotifications.filter((n) => {
        if (userId && n.userId === userId) return true;
        if (role && n.role === role) return true;
        if (branchId && n.branchId === branchId) return true;
        return !n.userId && !n.role && !n.branchId;
      });
      return filtered;
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

/**
 * Mark a notification as read
 */
const markNotificationAsRead = async (id) => {
  try {
    try {
      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
      return updated;
    } catch (dbErr) {
      const notif = mockNotifications.find((n) => n.id === id);
      if (notif) notif.isRead = true;
      return notif || { id, isRead: true };
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return null;
  }
};

module.exports = {
  createNotification,
  getNotificationsForUser,
  markNotificationAsRead,
  mockNotifications,
};
