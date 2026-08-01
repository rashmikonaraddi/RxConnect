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

router.use(protect);

router.post("/upload", upload.any(), uploadPrescription);

router.get("/", getPrescriptions);

router.patch("/:id/status", updatePrescriptionStatus);

module.exports = router;
