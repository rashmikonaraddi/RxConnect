const prisma = require("../config/db");

const getMedicines = async (req, res) => {
  try {
    const { search, category } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category && category !== "all") {
      where.category = { equals: category, mode: "insensitive" };
    }

    const items = await prisma.medicine.findMany({
      where,
      include: { inventories: true },
      orderBy: { name: "asc" },
    });

    return res.json({
      success: true,
      count: items.length,
      medicines: items,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getBranches = async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: "asc" },
    });

    return res.json({
      success: true,
      count: branches.length,
      branches,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getMedicines,
  getBranches,
};
