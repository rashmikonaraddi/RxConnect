const { getPrescriptions, updatePrescriptionStatus } = require("./prescriptionController");
const { getInventory, restockInventory } = require("./inventoryController");

module.exports = {
  getPrescriptions,
  updatePrescriptionStatus,
  getInventory,
  restockInventory,
};
