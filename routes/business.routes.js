// routes/business.routes.js
const express = require("express");
const Business = require("../models/Business");

const router = express.Router();

/**
 * GET /api/business
 * Filtros opcionales: country, city, neighborhood
 * Ej:
 *   /api/business?country=CO
 *   /api/business?country=CO&city=Bogotá
 *   /api/business?country=CO&city=Bogotá&neighborhood=Casablanca
 */
router.get("/", async (req, res) => {
  try {
    const { country, city, neighborhood } = req.query;

    const filter = {};
    if (country) filter.country = country;
    if (city) filter.city = city;
    if (neighborhood) filter.neighborhood = neighborhood;

    const businesses = await Business.find(filter).populate("owner", "name email");

    res.json({
      ok: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (error) {
    console.error("Error al obtener negocios:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener los negocios",
    });
  }
});

module.exports = router;
