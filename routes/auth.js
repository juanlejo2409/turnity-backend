// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const {
      role,
      name,
      business,
      country,
      city,
      neighborhood,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "El correo ya está registrado." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      role: role === "negocio" ? "negocio" : "usuario",
      name,
      business: role === "negocio" ? business : "",
      country: country || "CO",
      city,
      neighborhood,
      email,
      passwordHash,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Usuario registrado correctamente.",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        country: user.country,
        business: user.business
      },
      token,
    });
  } catch (error) {
    console.error("Error en /register:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Correo y contraseña son obligatorios." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Inicio de sesión correcto.",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        country: user.country,
        business: user.business,
      },
      token,
    });
  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

module.exports = router;
