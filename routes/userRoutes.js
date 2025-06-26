// routes/userRoutes.js
import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js"; // You must have a middleware to protect routes

const router = express.Router();

// @desc   Get current user profile (dashboard)
// @route  GET /api/user/profile
// @access Private
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("User profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
