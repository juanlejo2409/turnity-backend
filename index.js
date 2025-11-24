// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta simple para probar que el backend responde
app.get("/", (req, res) => {
  res.send("Turnity API funcionando ✅");
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Conexión a MongoDB Atlas y arranque del servidor
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Backend Turnity escuchando en http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
  });
