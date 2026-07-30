const prisma = require("../config/db");
const { createNotification } = require("../services/notificationService");

// In-Memory Sample Database for instant Postman testing & dev mode fallback when PostgreSQL is offline
let mockOrders = [
  {
    id: "ord-1048",
    branchId: "br-101",
    customerId: "usr-001",
    deliveryPartnerId: null,
    status: "PACKED",
    totalAmount: 365.0,
    deliveryPayout: 180.0,
    destination: "882 Park Avenue, Apt 12B",
    isPrescriptionVerified: true,
    notes: "Fragile medication - handle with care.",
    packedAt: new Date("2026-07-30T09:00:00Z"),
    deliveredAt: null,
    createdAt: new Date("2026-07-30T08:30:00Z"),
    branch: { id: "br-101", code: "BR-101", name: "Central Health Pharmacy - East Branch", address: "402 Medical Drive, Suite 10", phone: "+91 98765 43210" },
    customer: { id: "usr-001", fullName: "Emily Watson", phone: "+91 98765 12345", email: "emily@example.com" },
    items: [
      { id: "item-1", medicineName: "Metformin 500mg", quantity: 1, price: 220.0, isRx: true },
      { id: "item-2", medicineName: "Multivitamin Daily Plus", quantity: 1, price: 145.0, isRx: false }
    ]
  },
  {
    id: "ord-1050",
    branchId: "br-101",
    customerId: "usr-002",
    deliveryPartnerId: null,
    status: "PACKED",
    totalAmount: 80.0,
    deliveryPayout: 120.0,
    destination: "55 West End Street, House 4",
    isPrescriptionVerified: true,
    notes: null,
    packedAt: new Date("2026-07-30T09:15:00Z"),
    deliveredAt: null,
    createdAt: new Date("2026-07-30T08:45:00Z"),
    branch: { id: "br-101", code: "BR-101", name: "Central Health Pharmacy - East Branch", address: "402 Medical Drive, Suite 10", phone: "+91 98765 43210" },
    customer: { id: "usr-002", fullName: "Michael Chang", phone: "+91 98765 67890", email: "michael@example.com" },
    items: [
      { id: "item-3", medicineName: "Ibuprofen 400mg", quantity: 2, price: 80.0, isRx: false }
    ]
  },
  {
    id: "ord-unverified",
    branchId: "br-101",
    customerId: "usr-003",
    deliveryPartnerId: null,
    status: "VERIFIED",
    totalAmount: 185.0,
    deliveryPayout: 150.0,
    destination: "123 Main St",
    isPrescriptionVerified: false, // Hard Gate violation test target
    notes: "Unverified prescription test order",
    packedAt: null,
    deliveredAt: null,
    createdAt: new Date("2026-07-30T09:30:00Z"),
    branch: { id: "br-101", code: "BR-101", name: "Central Health Pharmacy - East Branch", address: "402 Medical Drive", phone: "+91 98765 43210" },
    customer: { id: "usr-003", fullName: "Test Unverified User", phone: "+91 98765 00000", email: "test@example.com" },
    items: []
  },
  {
    id: "ord-1042",
    branchId: "br-101",
    customerId: "usr-004",
    deliveryPartnerId: "DEL-002",
    status: "OUT_FOR_DELIVERY",
    totalAmount: 305.0,
    deliveryPayout: 150.0,
    destination: "123 Main St, Apt 4B",
    isPrescriptionVerified: true,
    notes: "Ring doorbell twice.",
    packedAt: new Date("2026-07-30T08:00:00Z"),
    deliveredAt: null,
    createdAt: new Date("2026-07-30T07:30:00Z"),
    branch: { id: "br-101", code: "BR-101", name: "Downtown Pharmacy", address: "104 Healthcare Blvd", phone: "+91 98765 99000" },
    customer: { id: "usr-004", fullName: "John Doe", phone: "+91 98765 23456", email: "john@example.com" },
    items: [
      { id: "item-4", medicineName: "Amoxicillin 500mg", quantity: 1, price: 185.0, isRx: true }
    ]
  },
  {
    id: "ord-0998",
    branchId: "br-101",
    customerId: "usr-005",
    deliveryPartnerId: "DEL-002",
    status: "DELIVERED",
    totalAmount: 150.0,
    deliveryPayout: 160.0,
    destination: "789 Pine Rd, Apt 2",
    isPrescriptionVerified: true,
    notes: "Handed to customer",
    packedAt: new Date("2026-07-30T06:00:00Z"),
    deliveredAt: new Date("2026-07-30T07:00:00Z"),
    createdAt: new Date("2026-07-30T05:30:00Z"),
    branch: { id: "br-101", code: "BR-101", name: "Downtown Pharmacy", address: "104 Healthcare Blvd", phone: "+91 98765 99000" },
    customer: { id: "usr-005", fullName: "David Miller", phone: "+91 98765 65432", email: "david@example.com" },
    items: []
  }
];

const getAvailableJobs = async (req, res) => {
  try {
    const { branchId } = req.query;
    const targetBranch = branchId || (req.user && req.user.branchId);

    try {
      const whereClause = {
        deliveryPartnerId: null,
        status: "PACKED",
        isPrescriptionVerified: true,
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

      return res.status(200).json({ success: true, count: availableJobs.length, data: availableJobs });
    } catch (dbErr) {
      let filtered = mockOrders.filter(
        (o) => o.deliveryPartnerId === null && o.status === "PACKED" && o.isPrescriptionVerified === true
      );
      if (targetBranch) {
        filtered = filtered.filter((o) => o.branchId === targetBranch || o.branch?.id === targetBranch);
      }
      return res.status(200).json({ success: true, mode: "dev_fallback", count: filtered.length, data: filtered });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error fetching available jobs.", error: error.message });
  }
};

const getActiveJobs = async (req, res) => {
  try {
    const deliveryPartnerId = req.user.id;

    try {
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

      return res.status(200).json({ success: true, count: activeJobs.length, data: activeJobs });
    } catch (dbErr) {
      const active = mockOrders.filter(
        (o) => o.deliveryPartnerId === deliveryPartnerId && ["PACKED", "OUT_FOR_DELIVERY"].includes(o.status)
      );
      return res.status(200).json({ success: true, mode: "dev_fallback", count: active.length, data: active });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error fetching active jobs.", error: error.message });
  }
};

const getDeliveryHistory = async (req, res) => {
  try {
    const deliveryPartnerId = req.user.id;

    try {
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
    } catch (dbErr) {
      const history = mockOrders.filter((o) => o.deliveryPartnerId === deliveryPartnerId && o.status === "DELIVERED");
      const totalEarnings = history.reduce((acc, job) => acc + (job.deliveryPayout || 150.0), 0);
      return res.status(200).json({
        success: true,
        mode: "dev_fallback",
        count: history.length,
        totalEarningsINR: totalEarnings,
        data: history,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error fetching delivery history.", error: error.message });
  }
};

const claimOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliveryPartnerId = req.user.id;

    let order = mockOrders.find((o) => o.id === orderId);

    try {
      const dbOrder = await prisma.order.findUnique({ where: { id: orderId } });
      if (dbOrder) order = dbOrder;
    } catch (dbErr) {
      // Memory fallback
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${orderId} not found.`,
      });
    }

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

    if (order.deliveryPartnerId && order.deliveryPartnerId !== deliveryPartnerId) {
      return res.status(400).json({
        success: false,
        message: "Order has already been claimed by another delivery partner.",
      });
    }

    try {
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
    } catch (dbErr) {
      order.deliveryPartnerId = deliveryPartnerId;
      return res.status(200).json({
        success: true,
        mode: "dev_fallback",
        message: `Order #${orderId} successfully claimed and assigned to partner!`,
        data: order,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error claiming delivery order.", error: error.message });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;
    const deliveryPartnerId = req.user.id;

    let order = mockOrders.find((o) => o.id === orderId);

    try {
      const dbOrder = await prisma.order.findUnique({ where: { id: orderId } });
      if (dbOrder) order = dbOrder;
    } catch (dbErr) {
      // Memory fallback
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${orderId} not found.`,
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

    // Trigger Notification for Order Customer (Issue #47)
    if (targetStatus === "OUT_FOR_DELIVERY") {
      await createNotification({
        userId: order.customerId || "usr-001",
        role: "CUSTOMER",
        title: "Order Out for Delivery",
        message: `Your prescription order #${orderId} is out for delivery with partner.`,
      });
    } else if (targetStatus === "DELIVERED") {
      await createNotification({
        userId: order.customerId || "usr-001",
        role: "CUSTOMER",
        title: "Order Delivered Successfully",
        message: `Your prescription order #${orderId} has been safely delivered to your address.`,
      });
    }

    try {
      const updateData = { status: targetStatus, notes: notes || order.notes };
      if (targetStatus === "DELIVERED") updateData.deliveredAt = new Date();

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
    } catch (dbErr) {
      order.status = targetStatus;
      if (notes) order.notes = notes;
      if (targetStatus === "DELIVERED") order.deliveredAt = new Date();

      return res.status(200).json({
        success: true,
        mode: "dev_fallback",
        message: `Order #${orderId} status successfully updated to '${targetStatus}'!`,
        data: order,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error updating delivery status.", error: error.message });
  }
};

module.exports = {
  getAvailableJobs,
  getActiveJobs,
  getDeliveryHistory,
  claimOrder,
  updateDeliveryStatus,
};
