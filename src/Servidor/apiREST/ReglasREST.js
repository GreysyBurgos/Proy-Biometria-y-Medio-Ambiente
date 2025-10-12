// @autor: Greysy Burgos Salazar
// Define las rutas de la API REST

const express = require("express");

function reglasREST(logica) {
  const router = express.Router();

  // POST /medida → guarda una fila con gas + humedad
  router.post("/medida", async (req, res) => {
    try {
      const { uuid, gas, humedad, contador } = req.body;
      if (!uuid || gas === undefined || humedad === undefined) {
        return res.status(400).json({
          status: "error",
          mensaje: "Faltan campos en el JSON (uuid, gas, humedad)"
        });
      }

      const medida = await logica.guardarMedida(uuid, gas, humedad, contador);
      res.json({ status: "ok", medida });
    } catch (err) {
      console.error("Error en POST /medida:", err);
      res.status(500).json({ status: "error", mensaje: "Error interno", detalle: err.message });
    }
  });

  // GET /medidas → devuelve las últimas filas
  router.get("/medidas", async (req, res) => {
    try {
      const { limit } = req.query;
      const filas = await logica.listarMedidas(limit);
      res.json({ status: "ok", medidas: filas });
    } catch (err) {
      console.error("Error en GET /medidas:", err);
      res.status(500).json({ status: "error", mensaje: "Error interno" });
    }
  });

  return router;
}

module.exports = reglasREST;