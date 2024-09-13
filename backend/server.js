const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb+srv://piyushguptaji123:test123@cluster0.n4sy9.mongodb.net/")
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("Connection error", err);
  });
// Models
const User = mongoose.model("User", {
  username: String,
  password: String,
  highScore: Number,
  scores: [Number],
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Register new user
// app.post("/api/register", async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new User({
//     username,
//     password: hashedPassword,
//     highScore: 0,
//     scores: [],
//   });
//   await user.save();
//   res.json({ message: "User registered successfully" });
// });

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      highScore: 0,
      scores: [],
    });

    // Save the user in the database
    await newUser.save();

    // Optionally, generate a token (JWT) if needed
    const token = jwt.sign({ id: newUser._id }, "secretkey", {
      expiresIn: "1h",
    });

    // Respond with a success message or token
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).send("Invalid password");

  const token = jwt.sign({ username: user.username }, "secretkey");
  res.json({ token, username: user.username });
});

// Fetch high score
app.get("/api/highscore", authenticateToken, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  res.json({ highScore: user.highScore });
});

// Fetch leaderboard
app.get("/api/leaderboard", async (req, res) => {
  const leaderboard = await User.find().sort({ highScore: -1 }).limit(10);
  res.json({ leaderboard });
});

// Save new score
app.post("/api/highscore", authenticateToken, async (req, res) => {
  const { score } = req.body;
  const user = await User.findOne({ username: req.user.username });

  if (score > user.highScore) {
    user.highScore = score;
  }

  await user.save();
  res.json({ message: "High score updated" });
});

// Save game score
app.post("/api/scores", authenticateToken, async (req, res) => {
  const { score } = req.body;
  const user = await User.findOne({ username: req.user.username });

  user.scores.push(score);
  await user.save();
  res.json({ message: "Score saved" });
});

// Start the server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
