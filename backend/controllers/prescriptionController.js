const prisma = require("../config/db");
const { createNotification } = require("../services/notificationService");

// @desc Upload new prescription (Stored in Database)
// @route POST /api/prescriptions/upload
const uploadPrescription = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required." });
    }

    const { doctorName, notes, imageUrl } = req.body;

    let finalImageUrl = imageUrl;
    const fileObj = req.file || (req.files && req.files[0]);
    if (fileObj) {
      finalImageUrl = `/uploads/${fileObj.filename}`;
    }

    if (!finalImageUrl) {
      finalImageUrl = "https://placehold.co/600x400/0b193c/emerald?text=Uploaded+Prescription+Scan";
    }

    const rx = await prisma.prescription.create({
      data: {
        userId,
        imageUrl: finalImageUrl,
        doctorName: doctorName || "Unspecified Doctor",
        notes: notes || null,
        status: "PENDING",
      },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    });

    // Send Notification to Pharmacists Queue
    await createNotification({
      role: "PHARMACIST",
      title: "New Prescription Uploaded",
      message: `Customer ${rx.user?.fullName || "User"} uploaded a new doctor prescription for verification.`,
      type: "INFO",
    });

    return res.status(201).json({
      success: true,
      message: "Prescription uploaded successfully and stored in database.",
      prescription: rx,
    });
  } catch (err) {
    console.error("Upload Rx error:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to upload prescription" });
  }
};

// @desc Get prescriptions from Database (Filtered for customer or pharmacist queue)
// @route GET /api/prescriptions
const getPrescriptions = async (req, res) => {
  try {
    const role = req.user?.role || "PHARMACIST";
    const userId = req.user?.id;
    const { status } = req.query;

    const where = {};
    if (role === "CUSTOMER" && userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status.toUpperCase();
    }

    const rxs = await prisma.prescription.findMany({
      where,
      orderBy: { uploadedAt: "desc" },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    });

    return res.json({
      success: true,
      count: rxs.length,
      prescriptions: rxs,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Update prescription status in Database (Pharmacist approve/reject with reason)
// @route PATCH /api/prescriptions/:id/status
const updatePrescriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status?.toUpperCase())) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const nextStatus = status.toUpperCase();
    const finalReason = nextStatus === "REJECTED" ? rejectionReason || "Invalid or unreadable prescription image." : null;

    const updated = await prisma.prescription.update({
      where: { id },
      data: {
        status: nextStatus,
        rejectionReason: finalReason,
      },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });

    // Notify Customer about prescription status change
    await createNotification({
      userId: updated.userId,
      role: "CUSTOMER",
      title: nextStatus === "APPROVED" ? "Prescription Approved ✓" : "Prescription Rejected ❌",
      message: nextStatus === "APPROVED"
        ? `Your prescription has been approved by the pharmacist. You can now order prescription items!`
        : `Your prescription was rejected. Reason: ${finalReason}`,
      type: nextStatus === "APPROVED" ? "SUCCESS" : "WARNING",
    });

    return res.json({
      success: true,
      message: `Prescription ${id} updated to ${nextStatus} in database.`,
      prescription: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  uploadPrescription,
  getPrescriptions,
  updatePrescriptionStatus,
};
