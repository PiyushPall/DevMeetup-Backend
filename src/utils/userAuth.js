const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_PVT_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = auth;