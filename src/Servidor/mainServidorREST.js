// mainServidorREST.js
const express = require("express");
const cors = require("cors");
const Logica = require("./Logica.js");

// ----------------------------------------------------------
// Crear servidor Express
// ----------------------------------------------------------
const app = express();
app.use(cors());             // permite peticiones desde fuera (Android, Postman…)
app.use(express.json());     // permite leer JSON del body

// ----------------------------------------------------------
// Crear instancia de la lógica de negocio
// ----------------------------------------------------------
const logica = new Logica({ database: "proy" });

// ----------------------------------------------------------
// Rutas (aquí pondremos los endpoints)
// ----------------------------------------------------------

// GET /medidas  → devuelve las últimas medidas
app.get("/medidas", async (req, res) => {
  try {
    const limite = parseInt(req.query.limit) || 50;
    const datos = await logica.listarMedidas(limite);
    res.json(datos);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /medida  → guarda una nueva medición
app.post("/medida", async (req, res) => {
  try {
    const resultado = await logica.guardarMedida(req.body);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// ----------------------------------------------------------
// Arrancar servidor
// ----------------------------------------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor REST escuchando en http://localhost:${PORT}`);
});
