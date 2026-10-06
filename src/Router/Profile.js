const express = require("express");
const userModel = require("../model/user");
const auth = require("../utils/userAuth");

const router = express.Router();

router.get("/users", auth, async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json({ status: true, message: "Users fetched successfully", data: users });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, message: "User profile fetched successfully", data: user });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ status: false, message: "User not found" });
    res.status(200).json({ status: true, message: "User fetched successfully", data: user });
  } catch (error) {
    res.status(400).json({ status: false, message: "Invalid user ID" });
  }
});

router.patch("/updateProfile", auth, async (req, res) => {
  try {
    const allowedFields = ["firstName", "lastName", "age", "profileImage", "phone", "skills"];
    const updates = {};

    for (const key of Object.keys(req.body)) {
      if (!allowedFields.includes(key)) {
        return res.status(400).json({ status: false, message: `Invalid field: ${key}` });
      }
      updates[key] = req.body[key];
    }

    if (updates.age !== undefined) updates.age = Number(updates.age);

    const user = await userModel.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ status: false, message: "User not found" });

    res.status(200).json({ status: true, message: "User updated successfully", data: user });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

router.patch("/user/:id", auth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ status: false, message: "You can only update your own profile" });
    }
    const allowedFields = ["firstName", "lastName", "age", "profileImage", "phone", "skills"];
    const updates = {};
    for (const key of Object.keys(req.body)) {
      if (!allowedFields.includes(key)) return res.status(400).json({ status: false, message: `Invalid field: ${key}` });
      updates[key] = req.body[key];
    }
    const user = await userModel.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ status: false, message: "User not found" });
    res.status(200).json({ status: true, message: "User updated successfully", data: user });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

router.delete("/user/:id", auth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) return res.status(403).json({ status: false, message: "You can only delete your own account" });
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ status: false, message: "User not found" });
    res.status(200).json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

module.exports = router;
