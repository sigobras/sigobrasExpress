module.exports = {
  async postPlazos(data) {
    try {
      const [rows, fields] = await pool.execute(
        "INSERT INTO plazos_historial SET ?",
        [data]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  },

  async putPlazos(data) {
    try {
      const [rows, fields] = await pool.execute(
        `
        INSERT INTO plazos_historial (
          id,
          tipo,
          nivel,
          descripcion,
          fecha_inicio,
          fecha_final,
          documento_resolucion_estado,
          observacion,
          fichas_id_ficha,
          n_dias,
          plazo_aprobado,
          fecha_aprobada
        ) VALUES ? ON DUPLICATE KEY UPDATE
        tipo = VALUES(tipo),
        descripcion = VALUES(descripcion),
        fecha_inicio = VALUES(fecha_inicio),
        fecha_final = VALUES(fecha_final),
        documento_resolucion_estado = VALUES(documento_resolucion_estado),
        observacion = VALUES(observacion),
        n_dias = VALUES(n_dias),
        plazo_aprobado = VALUES(plazo_aprobado),
        fecha_aprobada = VALUES(fecha_aprobada)
      `,
        [data]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  },

  async getPlazosPadres({ id_ficha }) {
    try {
      const [rows, fields] = await pool.execute(
        `
        SELECT
          plazos_historial.*,
          plazos_tipo.nombre tipo_nombre,
          DATE_FORMAT(fecha_inicio, '%Y-%m-%d') fecha_inicio,
          DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final,
          DATE_FORMAT(fecha_aprobada, '%Y-%m-%d') fecha_aprobada,
          CONCAT(accesos.nombre, ' ', accesos.apellido_paterno) usuario_nombre
        FROM
          plazos_historial
          LEFT JOIN plazos_tipo ON plazos_tipo.idplazos_tipo = plazos_historial.tipo
          LEFT JOIN accesos ON accesos.id_acceso = plazos_historial.archivo_editor
        WHERE
          plazos_historial.nivel = 1
          AND fichas_id_ficha = ?
        ORDER BY plazos_historial.fecha_inicio
      `,
        [id_ficha]
      );
      console.log("test");
      if (rows.length > 0) {
        // Rest of your code for processing rows
      }
      return rows;
    } catch (err) {
      throw err;
    }
  },

  async getPlazosHijos({ id_ficha, id_padre }) {
    try {
      const [rows, fields] = await pool.execute(
        `
        SELECT
          plazos_historial.*, plazos_tipo.nombre tipo_nombre,
          DATE_FORMAT(fecha_inicio, "%Y-%m-%d") fecha_inicio,
          DATE_FORMAT(fecha_final, "%Y-%m-%d") fecha_final,
          DATE_FORMAT(fecha_aprobada, "%Y-%m-%d") fecha_aprobada,
          CONCAT(accesos.nombre, ' ', accesos.apellido_paterno) usuario_nombre
        FROM
          plazos_historial
          LEFT JOIN plazos_tipo ON plazos_tipo.idplazos_tipo = plazos_historial.tipo
          LEFT JOIN accesos ON accesos.id_acceso = plazos_historial.archivo_editor
        WHERE
          plazos_historial.nivel = 2
          AND fichas_id_ficha = ?
          AND id_padre = ?
        ORDER BY plazos_historial.fecha_inicio
      `,
        [id_ficha, id_padre]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  },

  async deletePlazosPadresAndHijos({ id }) {
    try {
      const [rows, fields] = await pool.execute(
        `
        DELETE FROM plazos_historial
        WHERE
        id = ?
      `,
        [id]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  },
};
