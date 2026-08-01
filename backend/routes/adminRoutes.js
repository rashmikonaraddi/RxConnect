const express = require("express");
const router = express.Router();
const {
  getDashboardOverview,
  getAllUsers,
  updateUserRole,
  getAllBranches,
  createBranch,
  updateBranch,
  getBranchAnalytics,
  createMedicine,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Require auth & ADMIN role for all admin routes
router.use(protect);
router.use(authorize("ADMIN"));

// Issue #43 / #46: Admin Dashboard Overview Snapshot & Bottleneck Alerts
router.get("/overview", getDashboardOverview);

// Issue #44: User Management (Directory & Role Elevation)
router.get("/users", getAllUsers);
router.patch("/users/:userId/role", updateUserRole);
router.post("/users/:userId/role", updateUserRole); // Alias

// Issue #45: Physical Pharmacy Branch Management
router.get("/branches", getAllBranches);
router.post("/branches", createBranch);
router.patch("/branches/:branchId", updateBranch);
router.post("/branches/:branchId", updateBranch); // Alias

// Issue #46: Branch Sales & Revenue Analytics (Express v5 compliant routes)
router.get("/analytics", getBranchAnalytics);
router.get("/analytics/:branchId", getBranchAnalytics);

// Admin Medicine Catalog Management (Add Medicine to DB)
router.post("/medicines", createMedicine);

module.exports = router;
