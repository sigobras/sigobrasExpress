async function postImagenesObra({ url, descripcion, id_acceso, id_ficha }) {
  try {
    const query = `
      INSERT INTO
          fichas_imagenes
          (url, descripcion, accesos_id_acceso, fichas_id_ficha)
      VALUES
          (?, ?, ?, ?);
    `;
    const values = [url, descripcion, id_acceso, id_ficha];
    const result = await executeQuery(query, values);
    return result;
  } catch (err) {
    throw err;
  }
}

async function getImagenesObra({ id_ficha, cantidad }) {
  try {
    const query = `
      SELECT
          *
      FROM
          fichas_imagenes
      WHERE
          (fichas_id_ficha = ?)
      ORDER BY fecha_registro DESC
      LIMIT ?;
    `;
    const values = [id_ficha, parseInt(cantidad)];
    const result = await executeQuery(query, values);
    return result;
  } catch (err) {
    throw err;
  }
}

async function executeQuery(query, values) {
  const connection = await pool.getConnection();
  const [res] = await connection.query(query, [...values]);
  return res;
}

module.exports = {
  postImagenesObra,
  getImagenesObra,
};
