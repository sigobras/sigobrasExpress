module.exports = {
  async getDatosGenerales2(id_ficha) {
    try {
      const [rows] = await pool.query(
        "SELECT fichas.*, DATE_FORMAT(fecha_inicial, '%Y-%m-%d') fecha_inicial, DATE_FORMAT(resolucion_fecha, '%Y-%m-%d') resolucion_fecha FROM fichas WHERE fichas.id_ficha = ?",
        [id_ficha]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getPresupuestoCostoDirecto(id_ficha) {
    try {
      const [rows] = await pool.query(
        "SELECT SUM(componentes.presupuesto) monto FROM componentes WHERE componentes.fichas_id_ficha = ?",
        [id_ficha]
      );
      return rows[0] || {};
    } catch (error) {
      throw error;
    }
  },

  async getEstadoObra(id_ficha) {
    try {
      const [rows] = await pool.query(
        "SELECT estados.* FROM historialestados LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE Fichas_id_ficha = ? AND fecha_inicial = (SELECT MAX(fecha_inicial) FROM historialestados WHERE Fichas_id_ficha = ?)",
        [id_ficha, id_ficha]
      );
      return rows[0] || {};
    } catch (error) {
      throw error;
    }
  },

  async getDatosUsuario({ id_acceso, id_ficha }) {
    try {
      const query = `
        SELECT
          cargos.nombre AS cargo_nombre,
          accesos.nombre AS usuario_nombre
        FROM
          accesos
        LEFT JOIN
          fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
        LEFT JOIN
          cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
        WHERE
          id_acceso = ? AND Fichas_id_ficha = ?
      `;

      const [rows] = await pool.query(query, [id_acceso, id_ficha]);
      return rows[0] || {};
    } catch (error) {
      throw error;
    }
  },
};
