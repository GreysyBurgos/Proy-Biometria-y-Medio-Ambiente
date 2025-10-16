// @autor: Greysy Burgos Salazar
// API REST — Guarda y consulta mediciones de CO2 enviadas por Android

const express = require("express");

function reglasREST(logica) {
  const router = express.Router();

  // POST /medida → guarda una medición
  router.post("/medida", async (req, res) => {
    try {
      const { uuid, gas, contador } = req.body;

      if (!uuid || gas === undefined || contador === undefined) {
        return res.status(400).json({
          status: "error",
          mensaje: "Faltan campos en el JSON (uuid, gas, contador)",
        });
      }

      const medida = await logica.guardarMedida(uuid, gas, contador);
      res.json({ status: "ok", medida });
    } catch (err) {
      console.error("Error en POST /medida:", err);
      res.status(500).json({
        status: "error",
        mensaje: "Error interno del servidor",
        detalle: err.message,
      });
    }
  });

  // GET /medidas → devuelve las últimas mediciones
  router.get("/medidas", async (req, res) => {
    try {
      const { limit } = req.query;
      const filas = await logica.listarMedidas(limit);
      res.json({ status: "ok", medidas: filas });
    } catch (err) {
      console.error("Error en GET /medidas:", err);
      res.status(500).json({
        status: "error",
        mensaje: "Error interno del servidor",
        detalle: err.message,
      });
    }
  });

  return router;
}

module.exports = reglasREST;
