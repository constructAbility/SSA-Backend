const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  prefix: String,  
  count: Number,  
});

module.exports = mongoose.model("Counter", counterSchema);
