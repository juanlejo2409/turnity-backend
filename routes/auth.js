// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "supersecreturnity";

// ====== REGISTRO ======
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,        // "usuario" | "negocio" | "trabajador"
      country,
      city,
      neighborhood,
      business,    // solo si rol === "negocio"
      businessId,  // solo si rol === "trabajador" (y opcionalmente negocio)
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nombre, correo y contraseña son obligatorios." });
    }

    // ¿Ya existe ese correo?
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "El correo ya está registrado en Turnity." });
    }

    // Validaciones básicas según rol
    if (role === "negocio" && !business) {
      return res.status(400).json({
        message: "Debes ingresar el nombre del negocio para crear una cuenta de negocio.",
      });
    }

    if (role === "trabajador" && !businessId) {
      return res.status(400).json({
        message: "Debes ingresar el ID del negocio para registrarte como trabajador.",
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashed,
      role: role || "usuario",
      country: country || "CO",
      city: city || "",
      neighborhood: neighborhood || "",
      business: role === "negocio" ? (business || "") : "",
      // Si es negocio, podemos guardar su propio businessId más adelante cuando
      // lo generes definitivamente desde el panel.
      businessId: role === "trabajador" ? businessId : "",
    });

    await user.save();

    // Crear token
    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    // Respuesta homogénea con lo que espera el frontend
    res.status(201).json({
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
    console.error("Error en /api/auth/register:", error);
    res.status(500).json({ message: "Error en el servidor al registrar usuario." });
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
      return res.status(404).json({ message: "Usuario no existe." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({
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
    console.error("Error en /api/auth/login:", error);
    res.status(500).json({ message: "Error en el servidor al iniciar sesión." });
  }
});

module.exports = router;
