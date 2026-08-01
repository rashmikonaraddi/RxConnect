const prisma = require("../config/db");

const getInventory = async (req, res) => {
  try {
    const { branchId, search } = req.query;

    const where = {};
    if (branchId && branchId !== "all") {
      where.branchId = branchId;
    }
    if (search) {
      where.medicine = {
        name: { contains: search, mode: "insensitive" },
      };
    }

    const inventoryItems = await prisma.inventory.findMany({
      where,
      include: {
        medicine: true,
        branch: { select: { id: true, name: true, code: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: inventoryItems.length,
      inventory: inventoryItems,
    });
  } catch (err) {
    console.error("Error fetching inventory:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const restockInventory = async (req, res) => {
  try {
    const { inventoryId, medicineId, branchId, amount } = req.body;
    const qtyToAdd = parseInt(amount || 20, 10);

    let updated;
    if (inventoryId) {
      updated = await prisma.inventory.update({
        where: { id: inventoryId },
        data: { quantity: { increment: qtyToAdd } },
        include: { medicine: true, branch: true },
      });
    } else if (medicineId && branchId) {
      updated = await prisma.inventory.upsert({
        where: {
          medicineId_branchId: { medicineId, branchId },
        },
        update: { quantity: { increment: qtyToAdd } },
        create: {
          medicineId,
          branchId,
          quantity: qtyToAdd,
          threshold: 10,
        },
        include: { medicine: true, branch: true },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "inventoryId OR (medicineId AND branchId) required to restock.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Stock successfully increased by +${qtyToAdd} units.`,
      inventory: updated,
    });
  } catch (err) {
    console.error("Error restocking inventory:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getLowStockAlerts = async (req, res) => {
  try {
    const items = await prisma.inventory.findMany({
      include: {
        medicine: true,
        branch: { select: { id: true, name: true, code: true } },
      },
    });

    const lowStock = items.filter((item) => item.quantity <= item.threshold);

    return res.status(200).json({
      success: true,
      count: lowStock.length,
      lowStock,
    });
  } catch (err) {
    console.error("Error fetching low stock alerts:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getInventory,
  restockInventory,
  getLowStockAlerts,
};
