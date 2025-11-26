// routes/servicios.routes.js
const express = require("express");
const router = express.Router();

const Service = require("../models/Service");
const auth = require("../middleware/auth");

// ✅ Obtener servicios del negocio logueado
// GET /api/servicios
router.get("/", auth, async (req, res) => {
  try {
    const services = await Service.find({ owner: req.user.id }).sort("name");
    res.json(services);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// ✅ Crear un nuevo servicio (solo rol negocio)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "negocio") {
      return res
        .status(403)
        .json({ message: "Solo los negocios pueden crear servicios." });
    }

    const { name, durationMin, priceUSD } = req.body;

    if (!name || !durationMin || priceUSD == null) {
      return res
        .status(400)
        .json({ message: "Faltan campos: nombre, duración o precio." });
    }

    const service = await Service.create({
      owner: req.user.id,
      name,
      durationMin,
      priceUSD,
    });

    res.status(201).json(service);
  } catch (error) {
    console.error("Error al crear servicio:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// (Opcional) actualizar un servicio del negocio
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, durationMin, priceUSD } = req.body;

    const service = await Service.findOneAndUpdate(
      { _id: id, owner: req.user.id }, // 👈 asegura que solo toque lo suyo
      { name, durationMin, priceUSD },
      { new: true }
    );

    if (!service) {
      return res
        .status(404)
        .json({ message: "Servicio no encontrado para este negocio." });
    }

    res.json(service);
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// (Opcional) eliminar un servicio del negocio
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Service.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Servicio no encontrado para este negocio." });
    }

    res.json({ message: "Servicio eliminado." });
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

module.exports = router;
