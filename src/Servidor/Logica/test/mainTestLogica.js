// ---------------------------------------------------------------------------
// mainTestLogica.js - Pruebas unitarias de la capa de lógica (MySQL directo)
// ---------------------------------------------------------------------------

const assert = require("assert");
const Logica = require("../Logica.js");

// Configuración de conexión a tu base de datos local
const DB_CONFIG = {
  host: "localhost",
  port: 3307,
  user: "root",
  password: "",
  database: "proy",
};

describe("Test de la clase Logica.js (sin API)", function () {
  let logica;

  this.timeout(5000); // más tiempo por consultas lentas

  // Antes de todos los tests
  before(async function () {
    logica = new Logica(DB_CONFIG);
    const ok = await logica.probarConexion();
    assert.strictEqual(ok, true, "No se pudo conectar a MySQL");
  });

  // Después de todos los tests
  after(async function () {
    await logica.pool.end();
  });

  // -------------------------------------------------------
  it("guardarMedida() inserta una fila correctamente", async function () {
    const medida = await logica.guardarMedida("GTI-3A", 420, 1);
    assert.ok(medida.id, "No devolvió un id de inserción");
    assert.strictEqual(medida.uuid, "GTI-3A");
    assert.strictEqual(medida.contador, 1);
    assert.strictEqual(medida.gas, 420);
  });

  // -------------------------------------------------------
  it("listarMedidas() devuelve un array de resultados", async function () {
    const medidas = await logica.listarMedidas(5);
    assert.ok(Array.isArray(medidas), "No devolvió un array");
    assert.ok(medidas.length > 0, "No hay mediciones guardadas");
    assert.ok(medidas[0].fecha, "Las filas no incluyen campo fecha");
    assert.ok(medidas[0].contador !== undefined, "Las filas no incluyen campo contador");
    assert.ok(medidas[0].gas !== undefined, "Las filas no incluyen campo gas");
  });
});
