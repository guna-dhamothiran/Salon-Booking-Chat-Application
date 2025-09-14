const mongoose = require('mongoose');
const ServiceSchema = new mongoose.Schema({
  name: String,
  duration_minutes: Number,
  price: Number,
  category: String,
  description: String
});
module.exports = mongoose.model('Service', ServiceSchema);
