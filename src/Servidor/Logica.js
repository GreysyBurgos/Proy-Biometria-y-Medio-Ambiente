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

const mysql = require('mysql2/promise');

class Logica {
  constructor(cfg = {}) {
    //conexion a la base de datos
    this.pool = mysql.createPool({
      host: cfg.host || 'localhost',
      user: cfg.user || 'root',
      password: cfg.password || 'root',        
      database: cfg.database || 'proy',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  // prueba de conexion (ejecuta una mini consulta para ver si el servidor responde)
  async probarConexion() {
    const [rows] = await this.pool.query('SELECT 1 AS ok');
    return rows[0].ok === 1;
  }

  // Reglas minimas de negocio para guardar una medida
  /*Comprueba que los campos obligatorios estan rellenos
  rechaza valores fuera de rango
  inserta los datos en la tabla medidas de la base de datos*/
  async guardarMedida({ uuid, mac, tipoMedicion, valor, rssi, contador }) {
    if (!uuid || !tipoMedicion || valor === undefined || valor === null) {
      throw new Error('Faltan campos obligatorios: uuid, tipoMedicion, valor');
    }
    if (typeof valor !== 'number' || valor < 0 || valor > 5000) {
      throw new Error('Valor fuera de rango (0..5000)');
    }

    const sql = `INSERT INTO medidas (uuid, mac, tipoMedicion, valor, rssi, contador)
                 VALUES (?,?,?,?,?,?)`;
    const params = [uuid, mac || null, tipoMedicion, valor, rssi ?? null, contador ?? null];
    const [result] = await this.pool.query(sql, params);
    return { ok: true, idMedicion: result.insertId };
  }

  // Listado con limite 
  /*recupera las ultimas mediciones por defecto son 50
  devuelve un array de objetos json con los resultados*/
  async listarMedidas(limit = 50) {
    const lim = Math.max(1, Math.min(parseInt(limit, 10) || 50, 1000));
    const [rows] = await this.pool.query(
      'SELECT id, uuid, mac, tipoMedicion, valor, rssi, contador, fecha FROM medidas ORDER BY fecha DESC LIMIT ?',
      [lim]
    );
    return rows;
  }
}

module.exports = Logica;

// test de conxion rapido
if (require.main === module) {
  (async () => {
    try {
      const logica = new Logica({ database: 'proy' });
      const ok = await logica.probarConexion();
      console.log('Conexión a MySQL:', ok ? 'OK' : 'FALLO');
    } catch (e) {
      console.error('Error de conexión:', e.message);
    } finally {
      process.exit(0);
    }
  })();
}
