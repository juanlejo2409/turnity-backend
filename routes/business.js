// routes/business.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // usamos el modelo de usuario

// GET /api/business
// Filtros opcionales: ?country=CO&city=Bogotá&neighborhood=Casablanca
router.get("/", async (req, res) => {
  try {
    const { country, city, neighborhood } = req.query;

    // Solo negocios
    const query = { role: "negocio" };

    if (country) {
      query.country = country;
    }
    if (city) {
      query.city = city;
    }
    if (neighborhood) {
      query.neighborhood = neighborhood;
    }

    const businesses = await User.find(query).select(
      "name business country city neighborhood email"
    );

    res.json({
      ok: true,
      total: businesses.length,
      businesses,
    });
  } catch (error) {
    console.error("Error al obtener negocios:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener negocios",
    });
  }
});

module.exports = router;
