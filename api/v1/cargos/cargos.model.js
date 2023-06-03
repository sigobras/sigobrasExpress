const DB = {};

DB.obtenerTodos = async ({ id_ficha, cargos_tipo_id }) => {
  var query = `
               SELECT * FROM cargos
            `;
  var condiciones = [];
  if (cargos_tipo_id != "" && cargos_tipo_id != undefined) {
    condiciones.push(`(cargos_tipo_id = ${cargos_tipo_id})`);
  }
  if (condiciones.length > 0) {
    query += " WHERE " + condiciones.join(" AND ");
  }
  query += `
      ORDER BY cargos.nivel,id_Cargo
    `;
  try {
    const [res] = await pool.query(query);
    return res;
  } catch (error) {
    throw error;
  }
};
DB.obtenerTodosByObra = async ({ id_ficha, cargos_tipo_id }) => {
  var query = `
                SELECT
                    cargos.nombre cargo_nombre, cargos.id_cargo
                FROM
                    fichas_has_accesos
                        LEFT JOIN
                    accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
                        INNER JOIN
                    cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
                WHERE
                    fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
            `;
  var condiciones = [];
  if (cargos_tipo_id != "" && cargos_tipo_id != undefined) {
    condiciones.push(`(cargos_tipo_id = ${cargos_tipo_id})`);
  }
  if (condiciones.length > 0) {
    query += " AND " + condiciones.join(" AND ");
  }
  query += `
     GROUP BY cargos.id_Cargo
                ORDER BY cargos.nivel
    `;
  try {
    const [res] = await pool.query(query);
    return res;
  } catch (error) {
    throw error;
  }
};
DB.obtenerUltimoCargoById = async ({ id, id_ficha }) => {
  var query = `
              SELECT
                  fichas_has_accesos.id,
                  usuarios.apellido_paterno,
                  usuarios.apellido_materno,
                  usuarios.nombre
              FROM
                  fichas_has_accesos
                      LEFT JOIN
                  accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
                      INNER JOIN
                  cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo
                      LEFT JOIN
                  usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario
              WHERE
                  fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
                      AND id_Cargo = ${id}
              ORDER BY fichas_has_accesos.id DESC
              LIMIT 1
            `;
  try {
    const [res] = await pool.query(query);
    return res ? res[0] : {};
  } catch (error) {
    throw error;
  }
};
module.exports = DB;
