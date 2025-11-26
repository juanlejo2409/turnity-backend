// models/Service.js
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // dueño del servicio (el negocio)
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    durationMin: {
      type: Number,
      required: true,
      min: 1,
    },
    priceUSD: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
