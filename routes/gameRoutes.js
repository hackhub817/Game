const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

router.get("/highscore", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    res.json({ highScore: user.highScore });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch high score" });
  }
});

router.post("/highscore", authenticateToken, async (req, res) => {
  const { score } = req.body;

  try {
    const user = await User.findOne({ username: req.user.username });
    if (score > user.highScore) user.highScore = score;
    await user.save();
    res.json({ message: "High score updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update high score" });
  }
});

router.post("/scores", authenticateToken, async (req, res) => {
  const { score } = req.body;

  try {
    const user = await User.findOne({ username: req.user.username });
    user.scores.push(score);
    await user.save();
    res.json({ message: "Score saved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save score" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ highScore: -1 }).limit(10);
    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

module.exports = router;
