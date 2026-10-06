const express = require("express");
const mongoose = require("mongoose");
const auth = require("../utils/userAuth");
const connectionModel = require("../model/connection");

const router = express.Router();

// ==========================================
// SEND CONNECTION REQUEST
// ==========================================
router.post("/sendRequest/:toUserId", auth, async (req, res) => {
  try {
    const { toUserId } = req.params;
    const currentUserId = req.user.userId;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid User ID",
      });
    }

    // Prevent self request
    if (currentUserId === toUserId) {
      return res.status(400).json({
        status: false,
        message: "You cannot send a request to yourself",
      });
    }

    // Check existing pending/accepted connection
    const existingRequest = await connectionModel.findOne({
      $or: [
        {
          fromUserId: currentUserId,
          toUserId,
          status: { $in: ["pending", "accepted"] },
        },
        {
          fromUserId: toUserId,
          toUserId: currentUserId,
          status: { $in: ["pending", "accepted"] },
        },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        status: false,
        message: "Connection request already exists",
      });
    }

    // Create request
    const request = await connectionModel.create({
      fromUserId: currentUserId,
      toUserId,
      status: "pending",
    });

    return res.status(201).json({
      status: true,
      message: "Request sent successfully",
      data: request,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

// ==========================================
// ACCEPT / REJECT REQUEST
// ==========================================
router.patch("/acceptRequest/:id/:status", auth, async (req, res) => {
  try {
    const { id, status } = req.params;
    const currentUserId = req.user.userId;

    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status",
      });
    }

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid User ID",
      });
    }

    // Only recipient can accept/reject the request
    const request = await connectionModel.findOneAndUpdate(
      {
        fromUserId: id,
        toUserId: currentUserId,
        status: "pending",
      },
      {
        $set: {
          status,
        },
      },
      {
        new: true,
      },
    );

    if (!request) {
      return res.status(404).json({
        status: false,
        message: "No pending request found",
      });
    }

    return res.status(200).json({
      status: true,
      message: `Request ${status} successfully`,
      data: request,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

// ==========================================
// GET ALL INCOMING REQUESTS
// ==========================================
router.get("/view/allRequest", auth, async (req, res) => {
  try {
    const requests = await connectionModel
      .find({
        toUserId: req.user.userId,
        status: "pending",
      })
      .populate(
        "fromUserId",
        "firstName lastName profileImage",
      );

    return res.status(200).json({
      status: true,
      message: "All requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// ==========================================
// GET ACCEPTED CONNECTIONS
// ==========================================
router.get("/view/connections", auth, async (req, res) => {
  try {
    const currentUserId = req.user.userId;

    const connections = await connectionModel
      .find({
        $or: [
          {
            fromUserId: currentUserId,
            status: "accepted",
          },
          {
            toUserId: currentUserId,
            status: "accepted",
          },
        ],
      })
      .populate(
        "fromUserId",
        "firstName lastName emailId skills profileImage",
      )
      .populate(
        "toUserId",
        "firstName lastName emailId skills profileImage",
      );

    return res.status(200).json({
      status: true,
      message: "Connections fetched successfully",
      data: connections,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// ==========================================
// GET SENT PENDING REQUESTS
// ==========================================
router.get("/view/sentRequests", auth, async (req, res) => {
  try {
    const requests = await connectionModel
      .find({
        fromUserId: req.user.userId,
        status: "pending",
      })
      .select("toUserId");

    return res.status(200).json({
      status: true,
      message: "Sent requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// ==========================================
// GET SINGLE PENDING REQUEST
// ==========================================
router.get("/view/request/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid User ID",
      });
    }

    const request = await connectionModel
      .findOne({
        fromUserId: id,
        toUserId: req.user.userId,
        status: "pending",
      })
      .populate(
        "fromUserId",
        "firstName lastName emailId age skills profileImage phone",
      );

    if (!request) {
      return res.status(404).json({
        status: false,
        message: "No request found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Request fetched successfully",
      data: request,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;