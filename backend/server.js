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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});