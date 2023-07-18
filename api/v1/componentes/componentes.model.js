const DB = {};

DB.obtenerTodos = ({ id }) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT
        *
    FROM
        componentes
    WHERE
        expediente_id = ?
    `;
    pool
      .execute(query, [id])
      .then(([rows]) => {
        resolve(rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

DB.costoDirecto = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT
        SUM(componentes.presupuesto) monto
    FROM
        componentes
    WHERE
        componentes.fichas_id_ficha = ?
    `;
    pool
      .execute(query, [id_ficha])
      .then(([rows]) => {
        resolve(rows ? rows[0] : {});
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = DB;
