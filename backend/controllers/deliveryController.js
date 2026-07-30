const prisma = require("../config/db");

/**
 * @desc    Fetch available delivery jobs ready for pickup
 * @route   GET /api/delivery/available
 * @access  Private (Delivery Partner)
 * @rules   Hard Gate: Only orders where status === 'PACKED' AND isPrescriptionVerified === true
 */
const getAvailableJobs = async (req, res) => {
  try {
    const { branchId } = req.query;

    const whereClause = {
      deliveryPartnerId: null,
      status: "PACKED",
      isPrescriptionVerified: true,
    };

    if (branchId) {
      whereClause.branchId = branchId;
    } else if (req.user && req.user.branchId) {
      whereClause.branchId = req.user.branchId;
    }

    const availableJobs = await prisma.order.findMany({
      where: whereClause,
      include: {
        branch: {
          select: { id: true, code: true, name: true, address: true, phone: true },
        },
        customer: {
          select: { id: true, fullName: true, phone: true, email: true },
        },
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
      message: "Server error fetching available jobs.",
      error: error.message,
    });
  }
};

/**
 * @desc    Fetch active jobs assigned to the logged-in delivery partner
 * @route   GET /api/delivery/active
 * @access  Private (Delivery Partner)
 * @status   PACKED or OUT_FOR_DELIVERY
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
        branch: {
          select: { id: true, code: true, name: true, address: true, phone: true },
        },
        customer: {
          select: { id: true, fullName: true, phone: true, email: true },
        },
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
      message: "Server error fetching active jobs.",
      error: error.message,
    });
  }
};

/**
 * @desc    Fetch completed delivery history for logged-in delivery partner
 * @route   GET /api/delivery/history
 * @access  Private (Delivery Partner)
 * @status  DELIVERED
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
        branch: {
          select: { id: true, name: true, address: true },
        },
        customer: {
          select: { id: true, fullName: true, phone: true },
        },
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
      message: "Server error fetching delivery history.",
      error: error.message,
    });
  }
};

/**
 * @desc    Issue #40: Allow a delivery partner to claim/self-assign an available job
 * @route   POST /api/delivery/claim/:orderId
 * @access  Private (Delivery Partner)
 * @rules   Hard Gate: Order must be PACKED and isPrescriptionVerified === true
 */
const claimOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliveryPartnerId = req.user.id;

    // 1. Find Order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${orderId} not found.`,
      });
    }

    // 2. STRICT HARD GATE VALIDATION
    if (order.status !== "PACKED" || !order.isPrescriptionVerified) {
      return res.status(400).json({
        success: false,
        error: "HARD_GATE_VIOLATION",
        message: "Order cannot be claimed. Order must be PACKED and pharmacist-verified (isPrescriptionVerified === true) before dispatch.",
        details: {
          currentStatus: order.status,
          isPrescriptionVerified: order.isPrescriptionVerified,
        },
      });
    }

    // 3. Check if already claimed by another partner
    if (order.deliveryPartnerId && order.deliveryPartnerId !== deliveryPartnerId) {
      return res.status(400).json({
        success: false,
        message: "Order has already been claimed by another delivery partner.",
      });
    }

    // 4. Assign Order to Partner
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryPartnerId: deliveryPartnerId,
      },
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
    console.error("Error claiming order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error claiming delivery order.",
      error: error.message,
    });
  }
};

/**
 * @desc    Issue #41: Update Delivery Status (PACKED -> OUT_FOR_DELIVERY -> DELIVERED)
 * @route   PATCH /api/delivery/status/:orderId
 * @access  Private (Delivery Partner)
 */
const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;
    const deliveryPartnerId = req.user.id;

    // 1. Find Order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${orderId} not found.`,
      });
    }

    // 2. Ensure order belongs to logged-in delivery partner
    if (order.deliveryPartnerId !== deliveryPartnerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update status for an order assigned to another partner.",
      });
    }

    // 3. Validate Status Progression
    let targetStatus = status;

    if (!targetStatus) {
      // Auto progress if status not passed explicitly
      if (order.status === "PACKED") {
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

    // Prepare update data
    const updateData = {
      status: targetStatus,
      notes: notes || order.notes,
    };

    if (targetStatus === "DELIVERED") {
      updateData.deliveredAt = new Date();
    }

    // 4. Update Database
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        branch: { select: { name: true, address: true } },
        customer: { select: { fullName: true, phone: true } },
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
      message: "Server error updating delivery status.",
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
