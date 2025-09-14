const mongoose = require("mongoose");

const stylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String }
});

module.exports = mongoose.model("Stylist", stylistSchema);
