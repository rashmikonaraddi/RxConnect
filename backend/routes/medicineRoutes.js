const express = require("express");
const router = express.Router();
const { getMedicines, getBranches } = require("../controllers/medicineController");

router.get("/medicines", getMedicines);
router.get("/branches", getBranches);

module.exports = router;
