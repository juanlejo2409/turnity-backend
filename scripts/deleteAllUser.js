// scripts/deleteAllUsers.js
require("dotenv").config();
const mongoose = require("mongoose");

// 👇 AJUSTA ESTA RUTA SI TU MODELO SE LLAMA DISTINTO
const User = require("../models/User");

async function main() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI no está definida en el archivo .env");
    }

    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // 🧨 BORRAR TODOS LOS USUARIOS
    const result = await User.deleteMany({});
    console.log(`🧨 Usuarios borrados: ${result.deletedCount}`);

    await mongoose.disconnect();
    console.log("🔌 Desconectado. Listo, no hay usuarios en la colección.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error borrando usuarios:", err.message);
    process.exit(1);
  }
}

main();
