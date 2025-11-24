// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const authRoutes = require("./routes/auth");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Turnity API funcionando ✅");
});

// Rutas
app.use("/api/auth", authRoutes);

// ===== Iniciar servidor y conectar a MongoDB =====
async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI no está definida en las variables de entorno");
    }

    console.log("Conectando a MongoDB...");
    // 👇 AQUÍ está el cambio: SIN opciones extra
    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB conectado correctamente");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Turnity escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1); // Para que Render vea claramente el fallo si algo sale mal
  }
}

startServer();
