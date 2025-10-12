// ---------------------------------------------------------------------------
// mainTestAPI.js - Test completo de la API REST (POST + GET)
// ---------------------------------------------------------------------------

const request = require("request");
const assert = require("assert");

const API = "http://localhost:3000"; // URL de tu servidor local

// ---------------------------------------------------------------------------
// TEST 1: Inserción básica de medida
// ---------------------------------------------------------------------------
describe("✅ Test 1: Inserción básica de medida", function () {
  it("debería guardar una medición completa correctamente", function (done) {
    const medida = {
      uuid: "SENSOR-GTI-6",
      gas: 405.8,
      humedad: 55.2,
      contador: 12
    };

    request.post(
      {
        url: API + "/medida",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medida)
      },
      (err, res, body) => {
        assert.strictEqual(err, null, "Error al conectar con el servidor");
        assert.strictEqual(res.statusCode, 200, "Código HTTP inesperado");

        const respuesta = JSON.parse(body);
        assert.strictEqual(respuesta.status, "ok", "Estado distinto de OK");
        assert.strictEqual(respuesta.medida.uuid, medida.uuid);
        assert.strictEqual(respuesta.medida.contador, medida.contador);

        console.log("✔ Inserción confirmada con ID =", respuesta.medida.id);
        done();
      }
    );
  });
});

// ---------------------------------------------------------------------------
// TEST 2: Validación de JSON incompleto
// ---------------------------------------------------------------------------
describe("⚠️ Test 2: Validación de datos de entrada", function () {
  it("debería devolver error 400 si faltan campos obligatorios", function (done) {
    const medida = {
      uuid: "SENSOR-GTI-6",
      gas: 500.2
      // Falta humedad y contador
    };

    request.post(
      {
        url: API + "/medida",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medida)
      },
      (err, res, body) => {
        assert.strictEqual(err, null);
        assert.strictEqual(res.statusCode, 400, "No devolvió error 400");

        const respuesta = JSON.parse(body);
        assert.strictEqual(respuesta.status, "error");
        console.log("✔ API detectó correctamente JSON incompleto");
        done();
      }
    );
  });
});

// ---------------------------------------------------------------------------
// TEST 3: Comprobación de coherencia de respuesta
// ---------------------------------------------------------------------------
describe("🧠 Test 3: Coherencia de respuesta", function () {
  it("debería devolver exactamente los mismos datos que se insertaron", function (done) {
    const medida = {
      uuid: "GTI-6-DEMO",
      gas: 450.3,
      humedad: 70.8,
      contador: 8
    };

    request.post(
      {
        url: API + "/medida",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medida)
      },
      (err, res, body) => {
        assert.strictEqual(err, null);
        assert.strictEqual(res.statusCode, 200);

        const data = JSON.parse(body);
        const m = data.medida;

        assert.strictEqual(m.uuid, medida.uuid);
        //assert.strictEqual(m.gas, medida.gas);
        assert.ok(Math.abs(m.gas - medida.gas) < 0.001, `Gas distinto: ${m.gas} vs ${medida.gas}`);
        //assert.strictEqual(m.humedad, medida.humedad);
        assert.ok(Math.abs(m.humedad - medida.humedad) < 0.001, `Humedad distinto: ${m.humedad} vs ${medida.humedad}`);
        assert.strictEqual(m.contador, medida.contador);

        console.log("✔ Datos coherentes entre envío y respuesta");
        done();
      }
    );
  });
});

// ---------------------------------------------------------------------------
// TEST 4: Listado de mediciones (GET /medidas)
// ---------------------------------------------------------------------------
describe("📋 Test 4: Listado de mediciones", function () {
  it("GET /medidas debería devolver una lista con al menos una fila", function (done) {
    request.get(
      {
        url: API + "/medidas?limit=10",
        headers: { "Content-Type": "application/json" }
      },
      (err, res, body) => {
        assert.strictEqual(err, null);
        assert.strictEqual(res.statusCode, 200);

        const json = JSON.parse(body);
        const datos = Array.isArray(json.medidas) ? json.medidas : [];
        assert.ok(datos.length > 0, "El array está vacío o no existe");

        console.log("✔ GET /medidas devolvió", datos.length, "filas");
        done();
      }
    );
  });
});
