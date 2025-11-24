const express = require('express');
const router = express.Router();

// Datos de ejemplo por ahora (luego esto vendrá de la BD)
const serviciosDemo = [
  { id: 1, nombre: 'Corte de cabello', duracionMin: 30, precio: 30000 },
  { id: 2, nombre: 'Manicure', duracionMin: 45, precio: 25000 }
];

// GET /api/servicios
router.get('/', (req, res) => {
  res.json(serviciosDemo);
});

module.exports = router;
