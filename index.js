// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const serviciosRoutes = require("./routes/servicios.routes");
const authRoutes = require("./routes/auth");

// 👇 Asegúrate de que este archivo exista: routes/business.routes.js
const businessRoutes = require("./routes/business.routes");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("Turnity API funcionando ✅");
});

// 🔥 RUTA DE PRUEBA DIRECTA para /api/business
// Esto NO depende del archivo business.routes.js
app.get("/api/business", (req, res) => {
  res.send("Ruta /api/business definida directamente en index.js 👍");
});

// Rutas normales
app.use("/api/auth", authRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/business", businessRoutes); // cuando esté bien, usaremos esto

// ===== Iniciar servidor y conectar a MongoDB =====
async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI no está definida en las variables de entorno");
    }

    console.log("Conectando a MongoDB...");
    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB conectado correctamente");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Turnity escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
}

startServer();
