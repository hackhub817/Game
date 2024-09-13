const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  highScore: { type: Number, default: 0 },
  scores: [Number],
});

module.exports = mongoose.model("User", userSchema);
