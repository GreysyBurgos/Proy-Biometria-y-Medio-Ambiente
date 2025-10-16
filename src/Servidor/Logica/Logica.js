/* 
Logica.js
-----------------------------
Lógica de negocio del backend BLE.
Guarda y lee datos de las mediciones recibidas desde la app Android.
*/

const mysql = require("mysql2/promise");

class Logica {
  constructor(cfg = {}) {
    this.pool = mysql.createPool({
      host: cfg.host || "localhost",
      user: cfg.user || "root",
      password: cfg.password || "",
      database: cfg.database || "proy",
      port: cfg.port || 3307,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  // Verifica conexión a la BD
  async probarConexion() {
    const [rows] = await this.pool.query("SELECT 1 AS ok");
    return rows[0].ok === 1;
  }

  // Guarda una medición (uuid, gas, contador)
  async guardarMedida(uuid, gas, contador) {
    if (!uuid) throw new Error("Falta UUID del sensor");
    if (gas === undefined) throw new Error("Falta el valor del gas");
    if (contador === undefined) throw new Error("Falta contador");

    const conn = await this.pool.getConnection();
    try {
      const sql = `
        INSERT INTO medidas (uuid, gas, contador, fecha)
        VALUES (?, ?, ?, NOW())
      `;
      const [resultado] = await conn.execute(sql, [uuid, gas, contador]);
      const [filas] = await conn.execute(
        `SELECT * FROM medidas WHERE id = ?`,
        [resultado.insertId]
      );
      return filas[0];
    } finally {
      conn.release();
    }
  }

  // Devuelve las últimas mediciones ordenadas por fecha
  async listarMedidas(limit = 50) {
    const conn = await this.pool.getConnection();
    try {
      const lim = Math.max(1, Math.min(parseInt(limit, 10) || 50, 500));
      const sql = `
        SELECT id, uuid, gas, contador, fecha
        FROM medidas
        ORDER BY fecha DESC
        LIMIT ?
      `;
      const [filas] = await conn.execute(sql, [lim]);

      // Convertir fecha a zona horaria española
      return filas.map((fila) => {
        const fechaObj = new Date(fila.fecha);
        const fechaLocal = fechaObj.toLocaleString("es-ES", {
          timeZone: "Europe/Madrid",
          hour12: false,
        });
        return { ...fila, fechaLocal };
      });
    } finally {
      conn.release();
    }
  }
}

module.exports = Logica;
