// ---------------------------------------------------------------------------
// mainTestLogica.js - Pruebas unitarias de la capa de lógica (MySQL directo)
// ---------------------------------------------------------------------------

const assert = require("assert");
const Logica = require("../Logica");

// Configuración de conexión a tu base de datos local
const DB_CONFIG = {
  host: "localhost",
  port: 3307,           // ⚠️ muy importante: el puerto de tu MySQL
  user: "root",
  password: "",         // tu contraseña si la tienes (vacío si no)
  database: "proy"
};

describe("✅ Test de la clase Logica.js (sin API)", function () {
  let logica;

  // Más tiempo porque las consultas pueden tardar
  this.timeout(5000);

  // Antes de todos los tests: crear conexión
  before(async function () {
    logica = new Logica(DB_CONFIG);
    const ok = await logica.probarConexion();
    assert.strictEqual(ok, true, "No se pudo conectar a MySQL");
  });

  // Después de todos los tests: cerrar pool de conexiones
  after(async function () {
    await logica.pool.end();
  });

  // -------------------------------------------------------
  it("guardarMedida() inserta una fila correctamente", async function () {
    const medida = await logica.guardarMedida("GTI-3A", 420.5, 60.2, 1);
    assert.ok(medida.id, "No devolvió un id de inserción");
    assert.strictEqual(medida.uuid, "GTI-3A");
  });

  // -------------------------------------------------------
  it("listarMedidas() devuelve un array de resultados", async function () {
    const medidas = await logica.listarMedidas(5);
    assert.ok(Array.isArray(medidas), "No devolvió un array");
    assert.ok(medidas.length > 0, "No hay mediciones guardadas");
    assert.ok(medidas[0].fecha, "Las filas no incluyen campo fecha");
  });
});
