const validator = require("validator");
const mongoose = require("mongoose");

const validateUser = (req, res) => {
  const {
    firstName,
    lastName,
    password,
    email,
    age,
    gender,
    profileImage,
    phone,
    skills,
  } = req.body;

  if (validator.isEmpty(String(firstName || ""))) {
    throw new Error("FirstName is required");
  } else if (!validator.isLength(String(firstName), { min: 4 })) {
    throw new Error("FirstName length should be at least 4 characters");
  }
  if (validator.isEmpty(lastName || "")) {
    throw new Error("lastName is required");
  } else if (!validator.isLength(lastName, { min: 4 })) {
    throw new Error("lastName length should have atleast 4 character");
  }
  if (validator.isEmpty(password || "")) {
    throw new Error("password is required");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters and include uppercase, lowercase, number and symbol.",
    );
  }
  if (validator.isEmpty(email || "")) {
    throw new Error("Email is required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email address");
  }
  if (validator.isEmpty(String(age || ""))) {
    throw new Error("Age is required");
  } else if (!validator.isInt(String(age), { min: 18, max: 60 })) {
    throw new Error("Age must be between 1 and 120");
  }

  if (validator.isEmpty(String(phone) || "")) {
    throw new Error("Phone number is required");
  } else if (!validator.isMobilePhone(String(phone), "en-IN")) {
    throw new Error("Please enter a valid Indian phone number");
  }

  if (validator.isEmpty(gender || "")) {
    throw new Error("Gender is required");
  } else if (!["male", "female", "other"].includes(gender)) {
    throw new Error("Gender must be Male, Female, or Other");
  }

  if (validator.isEmpty(profileImage || "")) {
    throw new Error("Profile image URL is required");
  } else if (!validator.isURL(profileImage)) {
    throw new Error("Please enter a valid profile image URL");
  }

  if (!skills || skills.length === 0) {
    throw new Error("At least one skill is required");
  } else if (!Array.isArray(skills)) {
    throw new Error("Skills must be an array");
  }
};

const validateUserUpdate = (req) => {
  const { firstName, lastName, password, age, profileImage, skills } = req.body;

  if (firstName && firstName.length > 20) {
    throw new Error("First name should not exceed 20 characters");
  }

  if (lastName && lastName.length > 20) {
    throw new Error("Last name should not exceed 20 characters");
  }

  if (password && (password.length < 8 || password.length > 20)) {
    throw new Error("Password length must be between 8 and 20 characters");
  }

  if (age && (age < 15 || age > 60)) {
    throw new Error("Age must be between 15 and 60");
  }

  if (profileImage && profileImage.length > 100) {
    throw new Error("Profile image URL should not exceed 100 characters");
  }

  if (skills && skills.length > 10) {
    throw new Error("You can add at most 10 skills");
  }
};

const validateLogin = (req, res) => {
  const { email, password } = req.body;

  if (validator.isEmpty(email || "")) {
    throw new Error("Email is required");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email");
  }

  if (validator.isEmpty(password || "")) {
    throw new Error("Password is required");
  }
};

const validateSendRequest = (req) => {
  const { toUserId, status } = req.params;

  if (!mongoose.Types.ObjectId.isValid(toUserId)) {
    throw new Error("Invalid User ID");
  }

  const allowedStatus = ["pending"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid request status");
  }

  if (req.user.userId.toString() === toUserId.toString()) {
    throw new Error("You cannot send a request to yourself");
  }
};

const validateAcceptRequest = (req) => {
  const { id, status } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid User ID");
  }

  const allowedStatus = ["accepted", "rejected", "ignored", "interested"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid status");
  }
};

module.exports = {
  validateUser,
  validateUserUpdate,
  validateLogin,
  validateSendRequest,
  validateAcceptRequest,
};
