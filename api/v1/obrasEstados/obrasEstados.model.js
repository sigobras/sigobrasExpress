const mysql = require("mysql2/promise");

const pool = require("../../../config/db.config");

const DB = {};

DB.obtenerTodos = async ({ id_acceso }) => {
  try {
    const query = `
      SELECT
        estados.*
      FROM
        fichas_datosautomaticos
          LEFT JOIN
        fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas_datosautomaticos.fichas_id_ficha
          LEFT JOIN
        historialestados ON historialestados.id_historialEstado = fichas_datosautomaticos.estado_obra
          INNER JOIN
        estados ON estados.id_Estado = historialestados.Estados_id_Estado
      WHERE
        fichas_has_accesos.Accesos_id_acceso = ?
      GROUP BY id_Estado
    `;

    const [rows] = await pool.query(query, [id_acceso]);
    return rows;
  } catch (err) {
    throw err;
  }
};

module.exports = DB;
