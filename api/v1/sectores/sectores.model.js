const DB = {};

DB.obtenerTodosPublico = async ({ id_unidadEjecutora }) => {
  let query = `
    SELECT
      sectores.*
    FROM
      fichas
          LEFT JOIN
      unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
          INNER JOIN
      sectores ON sectores.idsectores = fichas.sectores_idsectores
    WHERE
        estado_publico
           `;
  const condiciones = [];
  const queryParams = [];

  if (id_unidadEjecutora != undefined && id_unidadEjecutora != 0) {
    condiciones.push(` (unidadejecutoras.id_unidadEjecutora = ?)`);
    queryParams.push(id_unidadEjecutora);
  }

  if (condiciones.length > 0) {
    query += " AND " + condiciones.join(" AND ");
  }

  query += `
    GROUP BY sectores.idsectores
    `;

  try {
    const [res] = await pool.execute(query, queryParams);
    return res;
  } catch (err) {
    throw err;
  }
};

DB.obtenerTodos = async ({ id_unidadEjecutora, id_acceso }) => {
  let query = `
    SELECT
        sectores.*
    FROM
        fichas
            LEFT JOIN
        fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
            LEFT JOIN
        unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
            INNER JOIN
        sectores ON sectores.idsectores = fichas.sectores_idsectores
    WHERE
        fichas_has_accesos.Accesos_id_acceso = ?
           `;
  const condiciones = [];
  const queryParams = [id_acceso];

  if (id_unidadEjecutora != undefined && id_unidadEjecutora != 0) {
    condiciones.push(` (unidadejecutoras.id_unidadEjecutora = ?)`);
    queryParams.push(id_unidadEjecutora);
  }

  if (condiciones.length > 0) {
    query += " AND " + condiciones.join(" AND ");
  }

  query += `
    GROUP BY sectores.idsectores
    `;

  try {
    const [res] = await pool.execute(query, queryParams);
    return res;
  } catch (err) {
    throw err;
  }
};

module.exports = DB;
