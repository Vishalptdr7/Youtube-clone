import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const tempUserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  avtar: { type: String, required: true },
  coverImage: { type: String },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
});

const TempUser = mongoose.model("TempUser", tempUserSchema);

export { TempUser };