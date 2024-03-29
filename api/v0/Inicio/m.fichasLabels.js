module.exports = {
  getFichasLabels({ id_ficha = 0, texto_buscar }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                SUM(IF(fichas_has_labels.fichas_id_ficha = ${id_ficha},
                    1,
                    0)) orden,
                fichas_labels.*
            FROM
                fichas_labels
                    LEFT JOIN
                fichas_has_labels ON fichas_has_labels.fichas_labels_id = fichas_labels.id

            `;
      var condiciones = [];
      if (texto_buscar != "" && texto_buscar != undefined) {
        condiciones.push(
          `(fichas_labels.nombre like \'%${texto_buscar}%\' || fichas_labels.descripcion like \'%${texto_buscar}%\')`
        );
      }
      if (condiciones.length > 0) {
        query += " WHERE " + condiciones.join(" AND ");
      }
      query += ` GROUP BY fichas_labels.id
            ORDER BY 1 DESC , fichas_labels.id DESC`;
      // resolve(query);
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  postFichasLabels(data) {
    return new Promise((resolve, reject) => {
      pool.query(`INSERT INTO fichas_labels set ?`, data, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getFichasAsignarLabels({ id_ficha, id_label }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
                SELECT
                    count(*) cantidad
                FROM
                    fichas_has_labels
                WHERE
                    fichas_id_ficha = ${id_ficha}
                    AND fichas_labels_id = ${id_label};
                `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
  getFichasLabelsAsignadas({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
                SELECT
                    fichas_labels.*
                FROM
                    fichas_has_labels
                        LEFT JOIN
                    fichas_labels ON fichas_labels.id = fichas_has_labels.fichas_labels_id
                WHERE
                    fichas_id_ficha = ${id_ficha}
                `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  postFichasAsignarLabels({ id_ficha, id_label }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
                INSERT INTO fichas_has_labels (fichas_id_ficha, fichas_labels_id)
                VALUES (${id_ficha}, ${id_label})
                on duplicate key update
                fichas_id_ficha=values(fichas_id_ficha),
                fichas_labels_id=values(fichas_labels_id)
                `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  deleteFichasAsignarLabels({ id_ficha, id_label }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
                DELETE FROM fichas_has_labels
                WHERE
                    fichas_id_ficha = ${id_ficha}
                    AND fichas_labels_id = ${id_label};
                `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  getPrimerPlazo({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
                SELECT
                    plazos_historial.*,
                    DATE_FORMAT(fecha_inicio, '%Y-%m-%d')fecha_inicio,
                    DATE_FORMAT(fecha_final, '%Y-%m-%d')fecha_final,
                    DATE_FORMAT(fecha_aprobada, '%Y-%m-%d')fecha_aprobada
                FROM
                    plazos_historial
                WHERE
                    fichas_id_ficha = ${id_ficha}
                LIMIT 1
                `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
  getUltimoPlazoAprobado({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
                SELECT
                    plazos_historial.*,
                    DATE_FORMAT(fecha_inicio, '%Y-%m-%d')fecha_inicio,
                    DATE_FORMAT(fecha_final, '%Y-%m-%d')fecha_final,
                    DATE_FORMAT(fecha_aprobada, '%Y-%m-%d')fecha_aprobada
                FROM
                    plazos_historial
                WHERE
                    fichas_id_ficha = ${id_ficha}
                    AND tipo = 3
                    AND plazo_aprobado
                ORDER BY id DESC
                LIMIT 1
                `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
  getUltimoPlazoSinAprobar({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
                SELECT
                    plazos_historial.*,
                    DATE_FORMAT(fecha_inicio, '%Y-%m-%d')fecha_inicio,
                    DATE_FORMAT(fecha_final, '%Y-%m-%d')fecha_final,
                    DATE_FORMAT(fecha_aprobada, '%Y-%m-%d')fecha_aprobada
                FROM
                    plazos_historial
                WHERE
                    fichas_id_ficha = ${id_ficha}
                    AND tipo = 3
                    AND COALESCE(plazo_aprobado, 0) = FALSE
                ORDER BY id DESC
                LIMIT 1
                `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
  getFotosCantidad({ id_ficha, fecha_inicial, fecha_final }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
                SELECT
                    COUNT(partidasimagenes.id_partidaImagen) cantidad
                FROM
                    componentes
                        LEFT JOIN
                    partidas ON partidas.componentes_id_componente = componentes.id_componente
                        LEFT JOIN
                    partidasimagenes ON partidasimagenes.partidas_id_partida = partidas.id_partida
                WHERE
                    componentes.fichas_id_ficha = ${id_ficha}
                        AND partidasimagenes.fecha > '${fecha_inicial}'
                        AND partidasimagenes.fecha <= '${fecha_final}'
                `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
  getFotosCantidadTotal({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
          SELECT
              COUNT(partidasimagenes.id_partidaImagen) cantidad
          FROM
              componentes
                  LEFT JOIN
              partidas ON partidas.componentes_id_componente = componentes.id_componente
                  LEFT JOIN
              partidasimagenes ON partidasimagenes.partidas_id_partida = partidas.id_partida
          WHERE
              componentes.fichas_id_ficha = ${id_ficha}
        `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
};
