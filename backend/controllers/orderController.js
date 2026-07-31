const prisma = require("../config/db");

// @desc Create new customer order in Database
// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const customerId = req.user?.id || req.body.customerId;
    if (!customerId) {
      return res.status(401).json({ success: false, message: "User authentication required." });
    }

    const { items, destination, branchId, paymentMethod, deliveryNotes } = req.body;

    if (!items || !items.length || !destination) {
      return res.status(400).json({ success: false, message: "Order items and delivery destination are required." });
    }

    // Get default branch if branchId not specified
    let targetBranchId = branchId;
    if (!targetBranchId) {
      const firstBranch = await prisma.branch.findFirst();
      if (!firstBranch) {
        return res.status(400).json({ success: false, message: "No active pharmacy branch found to assign order." });
      }
      targetBranchId = firstBranch.id;
    }

    const calculatedTotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const orderId = `RX-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = await prisma.order.create({
      data: {
        id: orderId,
        customerId,
        branchId: targetBranchId,
        totalAmount: calculatedTotal,
        destination,
        deliveryNotes: deliveryNotes || null,
        paymentMethod: paymentMethod || "CARD",
        paymentStatus: paymentMethod === "CASH" ? "PENDING_COD" : "PAID",
        status: "PLACED",
        items: {
          create: items.map((i) => ({
            medicineName: i.medicineName || i.name,
            quantity: i.quantity || 1,
            price: i.price || 0,
            isRx: Boolean(i.isRx || i.type === "Rx" || i.prescriptionRequired),
          })),
        },
      },
      include: { items: true, branch: true, customer: { select: { id: true, fullName: true, email: true } } },
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully and saved in database!",
      order: newOrder,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to place order" });
  }
};

// @desc Get customer orders from Database
// @route GET /api/orders
const getOrders = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const role = req.user?.role || "CUSTOMER";

    const where = {};
    if (role === "CUSTOMER" && customerId) {
      where.customerId = customerId;
    }

    const ordersList = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: true, branch: true, customer: { select: { id: true, fullName: true, email: true, phone: true } } },
    });

    return res.json({
      success: true,
      count: ordersList.length,
      orders: ordersList,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
};
