require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Rutas
const authRoutes = require("./routes/auth");      // si la carpeta se llama distinto, ajusta
const serviciosRoutes = require("./routes/servicios"); // igual aquí si cambió

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta básica para probar que el server responde
app.get("/", (req, res) => {
  res.send("Turnity API funcionando ✅");
});

app.use("/api/auth", authRoutes);
app.use("/api/servicios", serviciosRoutes);

// Puerto de Render
const PORT = process.env.PORT || 3000;

// Conexión a Mongo y arranque del servidor
async function startServer() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB conectado");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Turnity escuchando en puerto ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1); // si falla, Render ve el error y corta
  }
}

startServer();
