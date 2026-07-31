const { getOrders, createOrder } = require("./orderController");
const { getPrescriptions, uploadPrescription } = require("./prescriptionController");

module.exports = {
  getOrders,
  createOrder,
  getPrescriptions,
  uploadPrescription,
};
