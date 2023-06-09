const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerTodos = async () => {
  try {
    const query = `
      SELECT *
      FROM accesos
    `;
    const [rows] = await pool.query(query);
    return rows;
  } catch (err) {
    throw err;
  }
};

DB.existe = async ({ usuario }) => {
  try {
    const query = `
      SELECT *
      FROM accesos
      WHERE usuario = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [usuario]);
    return rows.length > 0;
  } catch (err) {
    throw err;
  }
};

DB.crear = async (data) => {
  try {
    const query = BaseModel.insert("accesos", data);
    const [result] = await pool.query(query);
    return result;
  } catch (err) {
    throw err;
  }
};

DB.obtenerUno = async ({ usuario }) => {
  try {
    const query = `
      SELECT *
      FROM accesos
      WHERE usuario = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [usuario]);
    return rows[0] || {};
  } catch (err) {
    throw err;
  }
};

DB.obtenerById = async ({ id_acceso }) => {
  try {
    const query = `
      SELECT *
      FROM accesos
      WHERE id_acceso = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [id_acceso]);
    return rows[0] || {};
  } catch (err) {
    throw err;
  }
};

DB.asignarObra = async (data) => {
  try {
    const query = BaseModel.insert("fichas_has_accesos", data);
    const [result] = await pool.query(query);
    return result;
  } catch (err) {
    throw err;
  }
};

DB.obtenerLastId = async () => {
  try {
    const query = `
      SELECT id_acceso AS id
      FROM accesos
      ORDER BY id_acceso DESC
      LIMIT 1
    `;
    const [rows] = await pool.query(query);
    return rows[0] || {};
  } catch (err) {
    throw err;
  }
};

DB.getDataAsignacion = async ({
  Fichas_id_ficha,
  Accesos_id_acceso,
  Cargos_id_cargo,
}) => {
  try {
    const query = new queryBuilder("fichas_has_accesos")
      .where([
        `Fichas_id_ficha = ${Fichas_id_ficha}`,
        `Accesos_id_acceso = ${Accesos_id_acceso}`,
        `cargos_id_Cargo = ${Cargos_id_cargo}`,
      ])
      .toString();
    const [rows] = await pool.query(query);
    return rows[0] || {};
  } catch (err) {
    throw err;
  }
};

module.exports = DB;
