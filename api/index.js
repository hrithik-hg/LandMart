import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(console.log("Server is running on 3000"));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const app = express();
