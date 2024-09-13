// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((error) => console.error("Database error:", error));

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, "frontend", "build")));
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
