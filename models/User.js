// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["usuario", "negocio"],
      required: true,
      default: "usuario",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    business: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      enum: ["CO", "MX", "CL", "ES", "US"],
      default: "CO",
    },
    city: {
      type: String,
      trim: true,
    },
    neighborhood: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
