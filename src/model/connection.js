const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    status: {
      type: String,
      required: true,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Prevent sending a request to yourself
connectionSchema.pre("validate", function () {
  if (
    this.fromUserId &&
    this.toUserId &&
    this.fromUserId.toString() === this.toUserId.toString()
  ) {
    throw new Error(
      "You cannot send a connection request to yourself.",
    );
  }
});

connectionSchema.index(
  { fromUserId: 1, toUserId: 1 },
  { unique: true },
);

module.exports = mongoose.model("Connection", connectionSchema);