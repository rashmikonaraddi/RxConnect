const prisma = require("../config/db");
const {
	getNotificationsForUser,
	markNotificationAsRead,
} = require("../services/notificationService");

// @desc Get notifications for the logged-in user/role (merged)
// @route GET /api/notifications
const getNotifications = async (req, res) => {
	try {
		const userId = req.user?.id ?? null;
		const role = req.user?.role ?? null;
		const branchId = req.user?.branchId ?? null;

		// Prefer service function if available, fallback to direct prisma query
		if (typeof getNotificationsForUser === "function") {
			const notifications = await getNotificationsForUser({ userId, role, branchId });
			const unreadCount = notifications.filter((n) => !n.isRead).length;
			return res.status(200).json({ success: true, unreadCount, count: notifications.length, data: notifications });
		}

		const items = await prisma.notification.findMany({
			where: {
				OR: [{ userId: userId || undefined }, { role: role || undefined }, { userId: null, role: null }],
			},
			orderBy: { createdAt: "desc" },
		});

		const unreadCount = items.filter((n) => !n.isRead).length;
		return res.status(200).json({ success: true, unreadCount, count: items.length, notifications: items });
	} catch (err) {
		console.error("Error fetching notifications:", err);
		return res.status(500).json({ success: false, message: err.message });
	}
};

// @desc Mark single notification as read
// @route PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
	try {
		const { id } = req.params;

		if (typeof markNotificationAsRead === "function") {
			const updated = await markNotificationAsRead(id);
			if (!updated) return res.status(404).json({ success: false, message: `Notification #${id} not found.` });
			return res.status(200).json({ success: true, message: `Notification #${id} marked as read.`, data: updated });
		}

		const updated = await prisma.notification.update({ where: { id }, data: { isRead: true } });
		return res.status(200).json({ success: true, notification: updated });
	} catch (err) {
		console.error("Error marking notification as read:", err);
		return res.status(500).json({ success: false, message: err.message });
	}
};

// @desc Mark all notifications as read
// @route PATCH /api/notifications/read-all
const markAllAsRead = async (req, res) => {
	try {
		const userId = req.user?.id;

		const where = {};
		if (userId) {
			where.OR = [{ userId }, { userId: null }];
		}

		await prisma.notification.updateMany({ where: { ...where, isRead: false }, data: { isRead: true } });
		return res.status(200).json({ success: true, message: "All notifications marked as read in database." });
	} catch (err) {
		console.error("Error marking all notifications as read:", err);
		return res.status(500).json({ success: false, message: err.message });
	}
};

// @desc Create a notification
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
		console.error("Error creating notification:", err);
		return res.status(500).json({ success: false, message: err.message });
	}
};

module.exports = {
	getNotifications,
	markAsRead,
	markAllAsRead,
	createNotification,
};

