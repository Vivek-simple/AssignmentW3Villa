const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;

    if (!token) {
      req.user = null;
      return res.redirect("/login");
    }

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Middleware Error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
