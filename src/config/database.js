const mongoose = require("mongoose");

const dbConnect = async (req, res) => {
  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = dbConnect;
