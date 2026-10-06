const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, age, phone, skills, skill, profileImage } = req.body;

    if (!firstName || !lastName || !emailId || !password || !age || !phone) {
      return res.status(400).json({ status: false, message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).json({ status: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUND || 10));
    const skillsArray = Array.isArray(skills) ? skills : skill ? [skill] : [];

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age: Number(age),
      phone: String(phone),
      skills: skillsArray,
      profileImage,
    });

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ status: true, message: "User created successfully", data: safeUser });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ status: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid credentials" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return res.status(401).json({ status: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_PVT_KEY,
      { expiresIn: "1d" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json({ status: true, message: "Login successful", token, user: safeUser });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

module.exports = router;
