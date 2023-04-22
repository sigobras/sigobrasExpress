const pool = require("../../../config/db.config"); // Reemplazar con la ruta correcta al archivo de pool

const DB = {};

DB.obtenerTodos = async ({ id_ficha }) => {
  try {
    const query = `
      SELECT
          *
      FROM
          comunicados_has_fichas
              LEFT JOIN
          comunicados ON comunicados.idcomunicados = comunicados_has_fichas.comunicados_idcomunicados
      WHERE
          fichas_id_ficha = ?
              AND fecha_inicial <= CURDATE()
              AND CURDATE() <= fecha_final
    `;

    const [res] = await pool.query(query, [id_ficha]);
    return res;
  } catch (err) {
    throw err;
  }
};

module.exports = DB;
