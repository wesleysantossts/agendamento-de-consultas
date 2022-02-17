const mongoose = require("mongoose");

const appointment = mongoose.Schema({
  nome: String,
  email: String,
  description: String,
  date: Date,
  time: String,
  finished: Boolean,
  notified: Boolean
});

module.exports = mongoose.model("Appointment", appointment);