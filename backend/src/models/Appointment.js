const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, default: "Demo User" },
  service: { type: String, default: "Haircut" },
  stylistId: { type: mongoose.Schema.Types.ObjectId, ref: "Stylist" },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  status: { type: String, default: "CONFIRMED" }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
