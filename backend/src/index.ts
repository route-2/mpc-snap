import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log(`Connected ----> mongo`);
    app.listen(process.env.PORT);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
