const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  uploadPrescription,
  getPrescriptions,
  updatePrescriptionStatus,
} = require("../controllers/prescriptionController");
const { protect } = require("../middleware/authMiddleware");

// Configure Multer storage for prescription uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `rx-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// All routes protected by Auth middleware
router.use(protect);

// Upload prescription (Customer)
router.post("/upload", upload.any(), uploadPrescription);

// Get prescriptions list (Customer / Pharmacist queue)
router.get("/", getPrescriptions);

// Update status (Pharmacist: Approve / Reject with reason)
router.patch("/:id/status", updatePrescriptionStatus);

module.exports = router;
