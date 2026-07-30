const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const deliveryRoutes = require("./routes/deliveryRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RxConnect Pharmacy Platform Backend API is Running 🚀",
  });
});

// Delivery Module Routes (Issues #40 & #41)
app.use("/api/delivery", deliveryRoutes);

// Admin Module Routes (Issues #43, #44, #45, #46)
app.use("/api/admin", adminRoutes);

// Using Port 5001 to avoid Windows System Service port 5000 conflict
const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Keep process event loop open
setInterval(() => {}, 100000);