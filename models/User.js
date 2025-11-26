// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 👇 IMPORTANTE: incluimos "trabajador"
    role: {
      type: String,
      enum: ["usuario", "negocio", "trabajador"],
      default: "usuario",
    },

    // Datos de localización
    country: { type: String, default: null },
    city: { type: String, default: null },
    neighborhood: { type: String, default: null },

    // Datos específicos de negocio
    businessName: { type: String, default: null }, // para rol "negocio"

    // Para trabajadores: a qué negocio pertenecen
    businessId: { type: String, default: null }, // ID de negocio T-XXXXXX
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
