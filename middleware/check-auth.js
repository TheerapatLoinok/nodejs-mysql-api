const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
      });
    }
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = {
  checkAuth: checkAuth,
};
