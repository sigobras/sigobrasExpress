const DB = {};

DB.obtenerTodosPublico = async () => {
  const query = `
    SELECT
      unidadejecutoras.*
    FROM
      fichas
    LEFT JOIN
      unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
    WHERE
      estado_publico
    GROUP BY unidadejecutoras.id_unidadEjecutora
    ORDER BY poblacion DESC
  `;

  try {
    const [res] = await pool.query(query);
    return res;
  } catch (err) {
    throw err;
  }
};

DB.obtenerTodos = async ({ id_acceso }) => {
  const query = `
    SELECT
      unidadejecutoras.*
    FROM
      unidadejecutoras
    LEFT JOIN
      fichas ON fichas.unidadEjecutoras_id_unidadEjecutora = unidadejecutoras.id_unidadEjecutora
    LEFT JOIN
      fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
    WHERE
      fichas_has_accesos.Accesos_id_acceso = ?
    GROUP BY unidadejecutoras.id_unidadEjecutora
    ORDER BY poblacion DESC
  `;

  try {
    const [res] = await pool.query(query, [id_acceso]);
    return res;
  } catch (err) {
    throw err;
  }
};

module.exports = DB;
