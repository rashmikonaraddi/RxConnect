const prisma = require("../config/db");
const { createNotification } = require("../services/notificationService");

/**
 * @desc Get available unassigned delivery jobs from Database
 * @route GET /api/delivery/available
 * @access Private (DELIVERY_PARTNER, ADMIN)
 */
const getAvailableJobs = async (req, res) => {
  try {
    const { branchId } = req.query;
    const targetBranch = branchId || (req.user && req.user.branchId);

    const whereClause = {
      deliveryPartnerId: null,
      status: { in: ["PLACED", "VERIFIED", "PACKED"] },
    };
    if (targetBranch) whereClause.branchId = targetBranch;

    const availableJobs = await prisma.order.findMany({
      where: whereClause,
      include: {
        branch: { select: { id: true, code: true, name: true, address: true, phone: true } },
        customer: { select: { id: true, fullName: true, phone: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: availableJobs.length,
      data: availableJobs,
    });
  } catch (error) {
    console.error("Error fetching available jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching available jobs from database.",
      error: error.message,
    });
  }
};

/**
 * @desc Get active deliveries claimed by current partner from Database
 * @route GET /api/delivery/active
 * @access Private (DELIVERY_PARTNER, ADMIN)
 */
const getActiveJobs = async (req, res) => {
  try {
    const deliveryPartnerId = req.user.id;

    const activeJobs = await prisma.order.findMany({
      where: {
        deliveryPartnerId: deliveryPartnerId,
        status: { in: ["PACKED", "OUT_FOR_DELIVERY"] },
      },
      include: {
        branch: { select: { id: true, code: true, name: true, address: true, phone: true } },
        customer: { select: { id: true, fullName: true, phone: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: activeJobs.length,
      data: activeJobs,
    });
  } catch (error) {
    console.error("Error fetching active jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching active jobs from database.",
      error: error.message,
    });
  }
};

/**
 * @desc Get completed delivery history for partner from Database
 * @route GET /api/delivery/history
 * @access Private (DELIVERY_PARTNER, ADMIN)
 */
const getDeliveryHistory = async (req, res) => {
  try {
    const deliveryPartnerId = req.user.id;

    const historyJobs = await prisma.order.findMany({
      where: {
        deliveryPartnerId: deliveryPartnerId,
        status: "DELIVERED",
      },
      include: {
        branch: { select: { id: true, name: true, address: true } },
        customer: { select: { id: true, fullName: true, phone: true } },
        items: true,
      },
      orderBy: { deliveredAt: "desc" },
    });

    const totalEarnings = historyJobs.reduce((acc, job) => acc + (job.deliveryPayout || 150.0), 0);

    return res.status(200).json({
      success: true,
      count: historyJobs.length,
      totalEarningsINR: totalEarnings,
      data: historyJobs,
    });
  } catch (error) {
    console.error("Error fetching delivery history:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching delivery history from database.",
      error: error.message,
    });
  }
};

/**
 * @desc Claim an available pickup job in Database
 * @route POST /api/delivery/claim/:orderId
 * @access Private (DELIVERY_PARTNER, ADMIN)
 */
const claimOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliveryPartnerId = req.user.id;

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${orderId} not found in database.`,
      });
    }

    if (!["PLACED", "VERIFIED", "PACKED"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: "HARD_GATE_VIOLATION",
        message: "Order cannot be claimed. Order must be ready for pickup.",
        details: { currentStatus: order.status },
      });
    }

    if (order.deliveryPartnerId && order.deliveryPartnerId !== deliveryPartnerId) {
      return res.status(400).json({
        success: false,
        message: "Order has already been claimed by another delivery partner.",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { deliveryPartnerId: deliveryPartnerId },
      include: {
        branch: { select: { name: true, address: true, phone: true } },
        customer: { select: { fullName: true, phone: true } },
        items: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Order #${orderId} successfully claimed and assigned to partner!`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error claiming delivery order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error claiming delivery order in database.",
      error: error.message,
    });
  }
};

/**
 * @desc Update delivery status (Out for Delivery -> Delivered) in Database
 * @route PATCH /api/delivery/status/:orderId
 * @access Private (DELIVERY_PARTNER, ADMIN)
 */
const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;
    const deliveryPartnerId = req.user.id;

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${orderId} not found in database.`,
      });
    }

    if (order.deliveryPartnerId && order.deliveryPartnerId !== deliveryPartnerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update status for an order assigned to another partner.",
      });
    }

    let targetStatus = status;
    if (!targetStatus) {
      if (order.status === "PACKED" || order.status === "PLACED" || order.status === "VERIFIED") {
        targetStatus = "OUT_FOR_DELIVERY";
      } else if (order.status === "OUT_FOR_DELIVERY") {
        targetStatus = "DELIVERED";
      } else {
        return res.status(400).json({
          success: false,
          message: `Order #${orderId} is already in state '${order.status}' and cannot progress further.`,
        });
      }
    }

    const validStatuses = ["OUT_FOR_DELIVERY", "DELIVERED"];
    if (!validStatuses.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition. Allowed values: [${validStatuses.join(", ")}]`,
      });
    }

    // Trigger Notification for Order Customer
    if (targetStatus === "OUT_FOR_DELIVERY") {
      await createNotification({
        userId: order.customerId,
        role: "CUSTOMER",
        title: "Order Out for Delivery",
        message: `Your prescription order #${orderId} is out for delivery with partner.`,
      });
    } else if (targetStatus === "DELIVERED") {
      await createNotification({
        userId: order.customerId,
        role: "CUSTOMER",
        title: "Order Delivered Successfully",
        message: `Your prescription order #${orderId} has been safely delivered to your address.`,
      });
    }

    const updateData = { status: targetStatus, deliveryNotes: notes || order.deliveryNotes };
    if (targetStatus === "DELIVERED") updateData.deliveredAt = new Date();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        branch: { select: { name: true, address: true } },
        customer: { select: { fullName: true, phone: true } },
        items: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Order #${orderId} status successfully updated to '${targetStatus}'!`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating delivery status in database.",
      error: error.message,
    });
  }
};

module.exports = {
  getAvailableJobs,
  getActiveJobs,
  getDeliveryHistory,
  claimOrder,
  updateDeliveryStatus,
};
