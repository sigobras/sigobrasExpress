const DB = {};

DB.obtenerTodos = async ({ id_ficha = 0, texto_buscar }) => {
  try {
    const condiciones = [];
    if (texto_buscar) {
      condiciones.push(
        `(fichas_labels.nombre LIKE ? || fichas_labels.descripcion LIKE ?)`
      );
    }
    const query = `
      SELECT
        SUM(IF(fichas_has_labels.fichas_id_ficha = ?, 1, 0)) orden,
        fichas_labels.*
      FROM
        fichas_labels
        LEFT JOIN fichas_has_labels ON fichas_has_labels.fichas_labels_id = fichas_labels.id
      ${condiciones.length > 0 ? "WHERE " + condiciones.join(" AND ") : ""}
      GROUP BY fichas_labels.id
      ORDER BY 1 DESC, fichas_labels.id DESC
    `;
    const [rows] = await pool.execute(
      query,
      texto_buscar
        ? [id_ficha, `%${texto_buscar}%`, `%${texto_buscar}%`]
        : [id_ficha]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

DB.crearLabel = async (data) => {
  try {
    const [result] = await pool.query("INSERT INTO fichas_labels SET ?", data);
    return result;
  } catch (error) {
    throw error;
  }
};

DB.obtenerTodosByObra = async ({ id_ficha }) => {
  try {
    const query = `
      SELECT
        fichas_labels.*
      FROM
        fichas_has_labels
        LEFT JOIN fichas_labels ON fichas_labels.id = fichas_has_labels.fichas_labels_id
      WHERE
        fichas_id_ficha = ?
    `;
    const [rows] = await pool.execute(query, [id_ficha]);
    return rows;
  } catch (error) {
    throw error;
  }
};

DB.obtenerCantidadByObra = async ({ id_ficha, id_label }) => {
  try {
    const query = `
      SELECT
        COUNT(*) cantidad
      FROM
        fichas_has_labels
      WHERE
        fichas_id_ficha = ? AND fichas_labels_id = ?
    `;
    const [rows] = await pool.execute(query, [id_ficha, id_label]);
    return rows.length ? rows[0] : {};
  } catch (error) {
    throw error;
  }
};

DB.agregarLabelObra = async ({ id_ficha, id_label }) => {
  try {
    const query = `
      INSERT INTO fichas_has_labels (fichas_id_ficha, fichas_labels_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        fichas_id_ficha = VALUES(fichas_id_ficha),
        fichas_labels_id = VALUES(fichas_labels_id)
    `;
    const [result] = await pool.execute(query, [id_ficha, id_label]);
    return result;
  } catch (error) {
    throw error;
  }
};

DB.quitarLabelObra = async ({ id_ficha, id_label }) => {
  try {
    const query = `
      DELETE FROM fichas_has_labels
      WHERE
        fichas_id_ficha = ? AND fichas_labels_id = ?
    `;
    const [result] = await pool.execute(query, [id_ficha, id_label]);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = DB;
