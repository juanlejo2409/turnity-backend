// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    // 👇 ahora soporta los 3 roles
    role: {
      type: String,
      enum: ["usuario", "negocio", "trabajador"],
      default: "usuario",
    },

    country: { type: String, default: "CO" },
    city: { type: String, default: "" },
    neighborhood: { type: String, default: "" },

    // Para dueños de negocio (rol "negocio")
    business: { type: String, default: "" },

    // Para dueños y trabajadores: ID del negocio tipo "T-XXXXX"
    businessId: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
