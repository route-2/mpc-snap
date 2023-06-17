import mongoose from "mongoose";
const { Schema } = mongoose;

var Share = new Schema({
  address: String,
  share: { type: String, required: true },
});

export const ShareModel = mongoose.model("Share", Share);
