// @autor: Greysy Burgos Salazar
// Servidor principal REST

// ----------------------------------------------------------------------
// mainServidorREST.js
// ----------------------------------------------------------------------

const express = require("express");
const cors = require("cors");
const Logica = require("./Logica/Logica");
const reglasREST = require("./apiREST/ReglasREST");

// ----------------------------------------------------------------------
// Configuración de la lógica (base de datos)
// ----------------------------------------------------------------------
const logica = new Logica({
  host: "localhost",
  user: "root",
  password: "",
  database: "proy",
  port: 3307
});

// ----------------------------------------------------------------------
// Configuración del servidor Express
// ----------------------------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------------
// Reglas REST
// ----------------------------------------------------------------------
app.use("/", reglasREST(logica));

// ----------------------------------------------------------------------
// Puesta en marcha del servidor
// ----------------------------------------------------------------------
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor REST escuchando en http://0.0.0.0:${PORT}`);  
});
