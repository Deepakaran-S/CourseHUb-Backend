import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = express.Router();

// ✅ Register Route
// routes/auth.js or wherever your register route is
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    console.log("REGISTER DATA:", req.body); // 🔍 Debug input

    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
});



// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Authenticated user route
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.name} (${req.user.role})` });
});

// ✅ Admin-only route
router.get("/admin", verifyToken, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Welcome Admin, you have full access!" });
});

// ✅ Teacher-only route
router.get("/teacher", verifyToken, authorizeRole("teacher"), (req, res) => {
  res.json({ message: "Welcome Teacher, you can manage your courses." });
});

export default router;
