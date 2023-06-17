import express, { Request, Response, Application } from "express";
import {ShareModel} from "../models/Share";
import Cryptr from "cryptr";

const router = express.Router();
router.post(
  "/",
  async (req: Request, res: Response) => {
    const cryptr = new Cryptr(process.env.SECRET_KEY!);
    const { address, shares } = req.body;
    const share = cryptr.encrypt(shares);
    const newShare = new ShareModel({
      address,
      share
    });
    try {
      await newShare.save();
      res.status(201).json(newShare);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  }
);

module.exports = router;


