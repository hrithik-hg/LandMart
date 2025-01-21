import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from './routes/user.route.js'
dotenv.config();

const app = express();
const PORT= process.env.PORT || 5000;



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });


  app.use('/api/user', userRoute);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


