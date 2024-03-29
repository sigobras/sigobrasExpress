const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerPresupuestosAprobados = ({ id_ficha, fecha }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        id,
        nombre,
        archivo,
        DATE_FORMAT(fecha, '%Y-%m-%d') fecha,
        resolucion
    FROM
        presupuestos_aprobados
    WHERE
        fichas_id_ficha = ${id_ficha}
        `;
    var condiciones = [];
    if (fecha) {
      condiciones.push(`( fecha > '${fecha}')`);
    }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += `
    ORDER BY fecha
    `;
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.guardarPresupuestoAprobado = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.insert("presupuestos_aprobados", data);
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarPresupuestoAprobado = ({
  id,
  resolucion,
  nombre,
  fecha,
  archivo,
}) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.update(
      "presupuestos_aprobados",
      {
        resolucion,
        nombre,
        fecha,
        archivo,
      },
      [`id = ${id}`]
    );
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.eliminarPresupuesto = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("presupuestos_aprobados")
      .del()
      .where(`id = ${id}`)
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
module.exports = DB;
