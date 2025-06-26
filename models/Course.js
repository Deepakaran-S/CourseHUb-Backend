import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: { type: String, default: "0" },
  lectures: { type: Number, default: 0 },
  hours: { type: String, default: "0 total hours" },
  level: { type: String, default: "All Levels" },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  image: { type: String, required: true },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
