import express from "express";
import Course from "../models/Course.js";
import { verifyToken } from "../middleware/verifyToken.js"; // Optional if it's protected

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public (or protected if needed)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error("Fetch courses error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
