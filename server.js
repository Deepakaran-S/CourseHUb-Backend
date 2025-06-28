import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/course.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const app = express();

// ✅ Enable CORS for frontend (React app)
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Authorization", "Content-Type"],
    exposedHeaders: ["Authorization"],
  })
);

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/user", userRoutes);


// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");

  // ✅ Start the server after DB connection
  app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
  );
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});
