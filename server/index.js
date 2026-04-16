import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

console.log("NEW SERVER RUNNING");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ THIS LINE IS THE MOST IMPORTANT
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});