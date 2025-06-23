import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import logger from "../utils/logger.js";

export const authMiddleware = async (req, res, next) => {
  let token = null;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Fallback
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }
  if (!token) {
    logger.warn("No token provided in request headers or cookies");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      logger.warn("Invalid token structure token : " + token);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      logger.warn("User not found for the provided token");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Token verification failed:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
