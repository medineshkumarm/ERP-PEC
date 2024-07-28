const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  file: {
    type: String, // This will store the file URL or path
    required: false,
  },
});

module.exports = mongoose.model("assignment", assignmentSchema);
