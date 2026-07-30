const express = require("express");
const cors = require("cors");
require("dotenv").config();

const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RxConnect Pharmacy Platform Backend API is Running 🚀",
  });
});

// Delivery Module Routes (Issues #40 & #41)
app.use("/api/delivery", deliveryRoutes);

// Using Port 5001 to avoid Windows System Service port 5000 conflict
const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Keep process event loop open
setInterval(() => {}, 100000);