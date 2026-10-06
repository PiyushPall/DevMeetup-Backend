const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbconnect = require("./src/config/database");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./src/Router/Auth");
const profileRouter = require("./src/Router/Profile");
const requestRouter = require("./src/Router/Request");

app.use("/user", authRouter);
app.use("/user", profileRouter);
app.use("/user", requestRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Server is working!",
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

dbconnect()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

module.exports = app;