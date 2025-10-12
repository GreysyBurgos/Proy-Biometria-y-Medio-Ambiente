/* 
Logica.js
-----------------------------
Lógica de negocio.
Encargada de:
- conectarse a la base de datos
- Guardar y leer los datos
- devolver resultados. 
*/

//@autor: Greysy Burgos Salazar

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

  async probarConexion() {
  const [rows] = await this.pool.query("SELECT 1 AS ok");
  return rows[0].ok === 1;
}

  // Guarda una medición con gas y humedad
  async guardarMedida(uuid, gas, humedad, contador) {
    if (!uuid) throw new Error("Falta UUID del sensor");
    if (gas === undefined && humedad === undefined)
      throw new Error("Debe enviarse al menos un valor (gas o humedad)");

    const conn = await this.pool.getConnection();
    try {
      const sql = `
        INSERT INTO medidas (uuid, gas, humedad, contador, fecha)
        VALUES (?, ?, ?, ?, NOW())
      `;
      const [resultado] = await conn.execute(sql, [uuid, gas, humedad, contador]);
      const [filas] = await conn.execute(`SELECT * FROM medidas WHERE id = ?`, [resultado.insertId]);
      return filas[0];
    } finally {
      conn.release();
    }
  }

  // Listar las últimas mediciones (convertir UTC → hora local en Node)
  async listarMedidas(limit = 50) {
  const conn = await this.pool.getConnection();
  try {
    const lim = Math.max(1, Math.min(parseInt(limit, 10) || 50, 500));
    const sql = `
      SELECT id, uuid, gas, humedad, contador, fecha
      FROM medidas
      ORDER BY fecha DESC
      LIMIT ?
    `;
    const [filas] = await conn.execute(sql, [lim]);

    // Convertimos la fecha en el propio Node.js
    const medidasConHoraLocal = filas.map((fila) => {
      const fechaObj = new Date(fila.fecha);
      const fechaLocal = fechaObj.toLocaleString("es-ES", {
        timeZone: "Europe/Madrid",
        hour12: false,
      });
      return { ...fila, fechaLocal };
    });

    return medidasConHoraLocal;
  } finally {
    conn.release();
  }
}

}

module.exports = Logica;
