import express, { Request, Response, Application } from "express";
import {ShareModel} from "./models/Share";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from 'cors';
// import routes

dotenv.config();

const app = express();
const PORT = process.env.PORT

app.post(
  "/",
  async (req: Request, res: Response) => {
   
    const newShare = new ShareModel({
      address : "0x00ad",
      share:"bb83765e"
    });
   
      await newShare.save();
      res.status(201).json(newShare);
  
  }
);

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log(`Connected ----> ${PORT}`);
    app.listen(PORT);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


