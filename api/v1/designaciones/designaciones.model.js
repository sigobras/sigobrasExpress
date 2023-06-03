const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};
DB.obtenerTodosByCargo = async ({ id_ficha, id_cargo }) => {
  try {
    let query = `
      SELECT
          designaciones.id,
          accesos.apellido_paterno,
          accesos.apellido_materno,
          accesos.nombre,
          DATE_FORMAT(fecha_inicio, '%Y-%m-%d') fecha_inicio,
          DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final,
          designaciones.memorandum,
          habilitado,
          celular,
          dni,
          direccion,
          cpt,
          email,
          cargos.nombre cargo_nombre
      FROM
          accesos
              LEFT JOIN
          fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
              INNER JOIN
          designaciones ON designaciones.fichas_has_accesos_id = fichas_has_accesos.id
                LEFT JOIN
          cargos ON cargos.id_Cargo = fichas_has_accesos.cargos_id_Cargo
      WHERE
          Fichas_id_ficha = ?
    `;

    const params = [id_ficha];

    if (id_cargo) {
      query += " AND Cargos_id_Cargo = ?";
      params.push(id_cargo);
    }

    query += " ORDER BY fecha_inicio DESC";

    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

DB.actualizarById = async ({
  id,
  fecha_inicio,
  fecha_final,
  tipoUndefined,
}) => {
  try {
    const query = `
      UPDATE designaciones
      SET fecha_inicio = ?,
          fecha_final = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [fecha_inicio, fecha_final, id]);
    return result;
  } catch (error) {
    throw error;
  }
};

DB.actualizarMemorandumById = async ({ id, memorandum }) => {
  try {
    const query = `
      UPDATE designaciones
      SET memorandum = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(query, [memorandum, id]);
    return result;
  } catch (error) {
    throw error;
  }
};

DB.guardarDesignacion = async (data) => {
  try {
    const query = `
      INSERT INTO designaciones (column1, column2, ...)
      VALUES (?, ?, ...)
    `;
    const [result] = await pool.execute(query, Object.values(data));
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = DB;
