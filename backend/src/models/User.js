const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  preferences: Object,
  last_visit: Date
}, { timestamps:true });
module.exports = mongoose.model('User', UserSchema);
