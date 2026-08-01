const prisma = require("../config/db");
const { createNotification } = require("../services/notificationService");

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

    const parsePrice = (p) => {
      if (typeof p === "number") return p;
      if (!p) return 0;
      const cleaned = String(p).replace(/[^0-9.]/g, "");
      return parseFloat(cleaned) || 0;
    };

    const itemsParsed = items.map((i) => ({
      medicineName: i.medicineName || i.name,
      quantity: i.quantity || 1,
      price: parsePrice(i.price),
      isRx: Boolean(i.isRx || i.type === "Rx" || i.prescriptionRequired),
    }));

    const calculatedTotal = itemsParsed.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = calculatedTotal > 0 ? 40 : 0;
    const finalTotal = calculatedTotal + deliveryFee;
    const orderId = `RX-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = await prisma.order.create({
      data: {
        id: orderId,
        customerId,
        branchId: targetBranchId,
        totalAmount: finalTotal,
        destination,
        deliveryNotes: deliveryNotes || null,
        paymentMethod: paymentMethod || "CARD",
        paymentStatus: paymentMethod === "CASH" ? "PENDING_COD" : "PAID",
        status: "PLACED",
        items: {
          create: itemsParsed,
        },
      },
      include: { items: true, branch: true, customer: { select: { id: true, fullName: true, email: true } } },
    });

    // Notify Customer about Order Placement
    await createNotification({
      userId: customerId,
      role: "CUSTOMER",
      title: `Order #${orderId} Placed Successfully`,
      message: `Your prescription order for ₹${finalTotal.toFixed(2)} was received and assigned to ${newOrder.branch?.name || "pharmacy"}.`,
      type: "SUCCESS",
    });

    // Notify Pharmacist & Delivery Partner Queues
    await createNotification({
      role: "PHARMACIST",
      branchId: targetBranchId,
      title: `New Order #${orderId} Verification Queue`,
      message: `A new order with ${itemsParsed.length} item(s) has been placed at branch ${newOrder.branch?.name}.`,
      type: "INFO",
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
