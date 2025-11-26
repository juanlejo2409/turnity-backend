// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Función auxiliar para generar un ID de negocio tipo T-XXXXX
function generateBusinessId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "T-";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ====== REGISTRO ======
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      country,
      city,
      neighborhood,
      business,      // nombre del negocio (solo para role=negocio)
      businessId,    // ID del negocio (solo para role=trabajador)
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nombre, correo y contraseña son obligatorios." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Este correo ya está registrado." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const finalRole = role || "usuario";

    const userData = {
      name,
      email: email.toLowerCase().trim(),
      password: hashed,
      role: finalRole,
      country: country || "CO",
      city: city || "",
      neighborhood: neighborhood || "",
      business: "",
      businessId: "",
    };

    // Si es negocio: generamos un businessId nuevo y guardamos el nombre del negocio
    if (finalRole === "negocio") {
      userData.business = business || "";
      userData.businessId = generateBusinessId();
    }

    // Si es trabajador: se vincula al businessId que llega del frontend
    if (finalRole === "trabajador") {
      if (!businessId) {
        return res
          .status(400)
          .json({ message: "Debes indicar el ID del negocio para registrarte como trabajador." });
      }

      // (Opcional pero recomendado) verificar que exista un negocio con ese businessId
      const owner = await User.findOne({ role: "negocio", businessId: businessId.trim() });
      if (!owner) {
        return res
          .status(404)
          .json({ message: "No se encontró un negocio con ese ID. Verifica el código." });
      }

      userData.businessId = businessId.trim();
      // Podrías copiar el nombre del negocio si quieres:
      userData.business = owner.business || "";
    }

    const user = new User(userData);
    await user.save();

    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "supersecret", {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        city: user.city,
        neighborhood: user.neighborhood,
        business: user.business,
        businessId: user.businessId,
      },
    });
  } catch (error) {
    console.error("Error en /register:", error);
    return res.status(500).json({ message: "Error interno al registrar el usuario." });
  }
});

// ====== LOGIN ======
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "supersecret", {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login correcto.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        city: user.city,
        neighborhood: user.neighborhood,
        business: user.business,
        businessId: user.businessId,
      },
    });
  } catch (error) {
    console.error("Error en /login:", error);
    return res.status(500).json({ message: "Error interno al iniciar sesión." });
  }
});

// (Opcional) Ruta para probar el token
router.get("/me", async (req, res) => {
  return res.send("Auth OK");
});

module.exports = router;
