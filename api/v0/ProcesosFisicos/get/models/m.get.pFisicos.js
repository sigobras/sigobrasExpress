const tools = require("../../../../../utils/format");

function formatoAvance(data) {
  if (data == null) {
    return 0;
  }
  if (isNaN(data)) {
    return data;
  }
  data = Number(data);
  if (isNaN(data)) {
    data = 0;
  }
  if (data == 0) {
    return 0;
  } else if (data < 1) {
    data = data.toLocaleString("es-PE", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  } else {
    data = data.toLocaleString("es-PE", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
  }
  return data;
}

function formato(data) {
  data = Number(data);
  if (isNaN(data)) {
    data = 0;
  }
  if (data == 0) {
    return 0;
  } else if (data < 1) {
    data = data.toLocaleString("es-PE", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  } else {
    data = data.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return data;
}

module.exports = {
  async getComponentes(id_ficha) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT componentes.* FROM componentes WHERE componentes.fichas_id_ficha = ?",
        id_ficha
      );
      connection.release();
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getTotalConteoPartidas({
    id_componente,
    id_prioridad,
    id_iconoCategoria,
    texto_buscar,
  }) {
    let query =
      "SELECT COUNT(partidas.id_partida) total FROM partidas WHERE partidas.componentes_id_componente = ?";
    const condiciones = [];
    if (id_prioridad !== 0) {
      condiciones.push(`(partidas.prioridades_id_prioridad = ${id_prioridad})`);
    }
    if (id_iconoCategoria !== 0) {
      condiciones.push(
        `(partidas.iconosCategorias_id_iconoCategoria =  ${id_iconoCategoria})`
      );
    }
    if (texto_buscar !== "") {
      condiciones.push(
        `(partidas.item like '%${texto_buscar}%' || partidas.descripcion like '%${texto_buscar}%')`
      );
    }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(query, [id_componente]);
      connection.release();
      return rows ? rows[0] : {};
    } catch (error) {
      throw error;
    }
  },

  async getPartidas(
    id_componente = null,
    id_actividad = null,
    id_ficha = null,
    formato = true
  ) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        `
        SELECT partidas.rendimiento, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partidas.metrado - COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partidas.metrado * partidas.costo_unitario) - (COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / partidas.metrado * 100 * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad, COALESCE(partidas.metrado / partidas.rendimiento, '') partida_duracion, COALESCE(estado_partida.mayorMetrado, FALSE) mayorMetrado, prioridades.valor prioridad_valor, prioridades.color prioridad_color, iconoscategorias.nombre iconocategoria_nombre
        FROM componentes
        INNER JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente
        LEFT JOIN (
          SELECT partidas.id_partida, TRUE mayorMetrado
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
          LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
          WHERE historialactividades.estado = 'Mayor Metrado'
          GROUP BY partidas.id_partida
        ) estado_partida ON estado_partida.id_partida = partidas.id_partida
        LEFT JOIN iconoscategorias ON iconoscategorias.id_iconoCategoria = partidas.iconosCategorias_id_iconoCategoria
        LEFT JOIN prioridades ON prioridades.id_prioridad = partidas.prioridades_id_prioridad
        LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
        LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
        LEFT JOIN (
          SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
          WHERE actividades.parcial > 0 AND historialactividades.estado IS NULL
          GROUP BY partidas.id_partida
        ) p1 ON p1.id_partida = partidas.id_partida
        LEFT JOIN (
          SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
          WHERE actividades.parcial < 0 AND historialactividades.estado IS NULL
          GROUP BY partidas.id_partida
        ) p2 ON p2.id_partida = partidas.id_partida
        LEFT JOIN (
          SELECT historialpartidas.estado, historialpartidas.partidas_id_partida
          FROM (
            SELECT MAX(id_historialPartida) id_historialPartida
            FROM historialpartidas
            GROUP BY historialpartidas.partidas_id_partida
          ) maximoHistorial
          LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida
        ) historialPartida ON historialPartida.partidas_id_partida = partidas.id_partida
        WHERE TRUE
          AND (partidas.componentes_id_componente = ? OR partidas.id_partida = (SELECT actividades.Partidas_id_partida FROM actividades WHERE actividades.id_actividad = ? LIMIT 1) OR componentes.fichas_id_ficha = ?)
        GROUP BY partidas.id_partida
        ORDER BY componentes.id_componente, partidas.item
        `,
        [id_componente, id_actividad, id_ficha]
      );

      connection.release();

      if (formato) {
        for (let i = 0; i < rows.length; i++) {
          const fila = rows[i];
          fila.key = i;
          if (fila.tipo === "titulo") {
            fila.unidad_medida = "";
            fila.metrado = "";
            fila.costo_unitario = "";
            fila.parcial = "";
            fila.avance_metrado = "";
            fila.avance_costo = "";
            fila.metrados_saldo = "";
            fila.metrados_costo_saldo = "";
            fila.porcentaje = "";
            fila.porcentaje_negatividad = "";
          } else {
            fila.metrado = formatoAvance(fila.metrado);
            fila.costo_unitario = formatoAvance(fila.costo_unitario);
            fila.parcial = formatoAvance(fila.parcial);
            fila.avance_metrado = formatoAvance(fila.avance_metrado);
            fila.avance_costo = formatoAvance(fila.avance_costo);
            fila.metrados_saldo = formatoAvance(fila.metrados_saldo);
            fila.metrados_costo_saldo = formatoAvance(
              fila.metrados_costo_saldo
            );
            fila.porcentaje = tools.formatoPorcentaje(fila.porcentaje);
          }
          if (fila.partida_duracion !== "") {
            fila.partida_duracion = fila.partida_duracion * 480;
            if (fila.partida_duracion < 60) {
              fila.partida_duracion = Math.round(fila.partida_duracion) + "m";
            } else if (fila.partida_duracion < 480) {
              const horas = Math.trunc(fila.partida_duracion / 60) + "h";
              const minutos = Math.round(fila.partida_duracion % 60) + "m";
              fila.partida_duracion = horas + " " + minutos;
            } else {
              const dias = Math.trunc(fila.partida_duracion / 480) + "d";
              const residuo_dias = Math.trunc(fila.partida_duracion % 480);
              const horas = Math.trunc(residuo_dias / 60) + "h";
              const minutos = Math.round(residuo_dias % 60) + "m";
              fila.partida_duracion = dias + " " + horas + " " + minutos;
            }
          }
        }
      }

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getPartidas2({
    id_componente,
    inicio,
    fin,
    id_prioridad,
    id_iconoCategoria,
    texto_buscar,
  }) {
    let query =
      "SELECT * FROM partidas WHERE partidas.componentes_id_componente = ?";
    const condiciones = [];
    if (id_prioridad !== 0) {
      condiciones.push(`(partidas.prioridades_id_prioridad = ${id_prioridad})`);
    }
    if (id_iconoCategoria !== 0) {
      condiciones.push(
        `(partidas.iconosCategorias_id_iconoCategoria =  ${id_iconoCategoria})`
      );
    }
    if (texto_buscar !== "") {
      condiciones.push(
        `(partidas.item like '%${texto_buscar}%' || partidas.descripcion like '%${texto_buscar}%')`
      );
    }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += " LIMIT ?, ?";

    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(query, [
        id_componente,
        inicio,
        fin,
      ]);
      connection.release();
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getPartidaById({ id_partida }) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM partidas WHERE id_partida = ?",
        [id_partida]
      );
      connection.release();
      return rows ? rows[0] : {};
    } catch (error) {
      throw error;
    }
  },

  async getAvancePartida(id_partida) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT partidas.metrado,partidas.metrado*partidas.costo_unitario presupuesto, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_soles FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE actividades.Partidas_id_partida = ?",
        [id_partida]
      );
      connection.release();
      return rows ? rows[0] : {};
    } catch (error) {
      throw error;
    }
  },

  async getPartidasMayorMetradoAvance(id_partida) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        `
        SELECT partida.id_partida, partida.avance_metrado * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, partida.avance_costo * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partida.metrado - COALESCE(partida.avance_metrado, 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partida.metrado * partida.costo_unitario) - (COALESCE(partida.avance_costo, 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, partida.porcentaje * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje
        FROM (
          SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
          LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
          WHERE (actividades.parcial > 0 OR partidas.tipo = 'titulo') and historialactividades.estado = 'Mayor Metrado'
          GROUP BY partidas.id_partida
        ) partida
        LEFT JOIN (
          SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
          LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
          WHERE actividades.parcial < 0 and historialactividades.estado = 'Mayor Metrado'
          GROUP BY partidas.id_partida
        ) p2 ON p2.id_partida = partida.id_partida
        WHERE partida.id_partida = ?
        `,
        [id_partida]
      );

      connection.release();

      if (rows) {
        for (let i = 0; i < rows.length; i++) {
          const fila = rows[i];
          fila.avance_metrado = formato(fila.avance_metrado);
          fila.avance_costo = formato(fila.avance_costo);
          fila.metrados_saldo = formato(fila.metrados_saldo);
          fila.metrados_costo_saldo = formato(fila.metrados_costo_saldo);
          fila.porcentaje = formato(fila.porcentaje);
        }
      }

      return rows ? rows[0] : {};
    } catch (error) {
      throw error;
    }
  },
  async getActividades(id_partida) {
    try {
      const query = `/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/
        SELECT partida.id_partida, actividades.id_actividad, actividades.tipo actividad_tipo, historialactividades.estado actividad_estado, actividades.nombre nombre_actividad, actividades.veces veces_actividad, actividades.largo largo_actividad, actividades.ancho ancho_actividad, actividades.alto alto_actividad, actividades.parcial metrado_actividad, partida.costo_unitario, actividades.parcial * partida.costo_unitario parcial_actividad, COALESCE(SUM(avanceactividades.valor), 0) actividad_avance_metrado, COALESCE(SUM(avanceactividades.valor * partida.costo_unitario), 0) actividad_avance_costo, actividades.parcial - COALESCE(SUM(avanceactividades.valor), 0) actividad_metrados_saldo, actividades.parcial * partida.costo_unitario - COALESCE(SUM(avanceactividades.valor * partida.costo_unitario), 0) actividad_metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / actividades.parcial * 100 actividad_porcentaje, TRIM(TRAILING '/DIA' FROM partida.unidad_medida) unidad_medida
        FROM (
          SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor * partidas.costo_unitario) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
          WHERE actividades.parcial > 0 OR partidas.tipo = 'titulo'
          GROUP BY partidas.id_partida
        ) partida
        LEFT JOIN (
          SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          WHERE actividades.parcial < 0
          GROUP BY partidas.id_partida
        ) p2 ON p2.id_partida = partida.id_partida
        INNER JOIN actividades ON actividades.Partidas_id_partida = partida.id_partida
        LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
        WHERE partida.id_partida = ?
        GROUP BY actividades.id_actividad`;

      const [rows] = await pool.query(query, [id_partida]);

      if (rows.length === 0) {
        return "vacio";
      }

      for (let i = 0; i < rows.length; i++) {
        const fila = rows[i];
        if (fila.actividad_tipo === "titulo") {
          fila.veces_actividad = "";
          fila.largo_actividad = "";
          fila.ancho_actividad = "";
          fila.alto_actividad = "";
          fila.metrado_actividad = "";
          fila.costo_unitario = "";
          fila.parcial_actividad = "";
          fila.actividad_avance_metrado = "";
          fila.actividad_avance_costo = "";
          fila.actividad_metrados_saldo = "";
          fila.actividad_metrados_costo_saldo = "";
          fila.actividad_porcentaje = "";
          fila.unidad_medida = "";
        } else if (fila.parcial_actividad < 0) {
          fila.parcial_actividad = 0;
          fila.actividad_avance_metrado = 0;
          fila.actividad_avance_costo = 0;
          fila.actividad_metrados_saldo = 0;
          fila.actividad_metrados_costo_saldo = 0;
          fila.actividad_porcentaje = 0;
          fila.unidad_medida = 0;
        } else {
          fila.veces_actividad = formatoAvance(fila.veces_actividad);
          fila.largo_actividad = formatoAvance(fila.largo_actividad);
          fila.ancho_actividad = formatoAvance(fila.ancho_actividad);
          fila.alto_actividad = formatoAvance(fila.alto_actividad);
          fila.metrado_actividad = formatoAvance(fila.metrado_actividad);
          fila.costo_unitario = formatoAvance(fila.costo_unitario);
          fila.parcial_actividad = formatoAvance(fila.parcial_actividad);
          fila.actividad_avance_metrado = formatoAvance(
            fila.actividad_avance_metrado
          );
          fila.actividad_avance_costo = formatoAvance(
            fila.actividad_avance_costo
          );
          fila.actividad_metrados_saldo = formatoAvance(
            fila.actividad_metrados_saldo
          );
          fila.actividad_metrados_costo_saldo = formatoAvance(
            fila.actividad_metrados_costo_saldo
          );
          fila.actividad_porcentaje = formatoAvance(fila.actividad_porcentaje);
        }
      }

      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getActividades2(id_partida) {
    try {
      const query =
        "SELECT actividades.* FROM actividades WHERE actividades.Partidas_id_partida = ? GROUP BY actividades.id_actividad";
      const [rows] = await pool.query(query, [id_partida]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getAvanceActividad(id_actividad) {
    try {
      const query =
        "SELECT actividades.parcial metrado, actividades.parcial * partidas.costo_unitario presupuesto, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_soles FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE actividades.id_actividad = ?";
      const [rows] = await pool.query(query, [id_actividad]);
      return rows.length ? rows[0] : {};
    } catch (error) {
      throw error;
    }
  },
  async getComponentesPNuevas(id_ficha) {
    try {
      const query =
        "SELECT componentes.* FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Partida Nueva' AND componentes.fichas_id_ficha = ? GROUP BY componentes.id_componente";
      const [rows] = await pool.query(query, [id_ficha]);

      if (rows.length === 0) {
        return "vacio";
      }

      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getPartidasPNuevas(id_componente) {
    try {
      const query = `/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/
        SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partidas.metrado - COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partidas.metrado * partidas.costo_unitario) - (COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / partidas.metrado * 100 * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad, COALESCE(partidas.metrado / partidas.rendimiento, '') partida_duracion, COALESCE(estado_partida.mayorMetrado, FALSE) mayorMetrado, prioridades.valor prioridad_valor, prioridades.color prioridad_color, iconoscategorias.nombre iconocategoria_nombre
        FROM partidas
        LEFT JOIN (
          SELECT partidas.id_partida, TRUE mayorMetrado
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
          LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
          WHERE historialactividades.estado = 'Mayor Metrado'
          GROUP BY partidas.id_partida
        ) estado_partida ON estado_partida.id_partida = partidas.id_partida
        LEFT JOIN iconoscategorias ON iconoscategorias.id_iconoCategoria = partidas.iconosCategorias_id_iconoCategoria
        LEFT JOIN prioridades ON prioridades.id_prioridad = partidas.prioridades_id_prioridad
        LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
        LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
        LEFT JOIN (
          SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
          WHERE actividades.parcial > 0 AND historialactividades.estado IS NULL
          GROUP BY partidas.id_partida
        ) p1 ON p1.id_partida = partidas.id_partida
        LEFT JOIN (
          SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
          WHERE actividades.parcial < 0 AND historialactividades.estado IS NULL
          GROUP BY partidas.id_partida
        ) p2 ON p2.id_partida = partidas.id_partida
        LEFT JOIN (
          SELECT historialpartidas.estado, historialpartidas.partidas_id_partida
          FROM (
            SELECT MAX(id_historialPartida) id_historialPartida
            FROM historialpartidas
            GROUP BY historialpartidas.partidas_id_partida
          ) maximoHistorial
          LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida
        ) historialPartida ON historialPartida.partidas_id_partida = partidas.id_partida
        WHERE historialactividades.estado = 'Partida Nueva' AND partidas.componentes_id_componente = ?
        GROUP BY partidas.id_partida`;

      const [rows] = await pool.query(query, [id_componente]);

      if (rows.length === 0) {
        return "vacio";
      }

      for (let i = 0; i < rows.length; i++) {
        const fila = rows[i];
        if (fila.tipo === "titulo") {
          fila.unidad_medida = "";
          fila.metrado = "";
          fila.costo_unitario = "";
          fila.parcial = "";
          fila.avance_metrado = "";
          fila.avance_costo = "";
          fila.metrados_saldo = "";
          fila.metrados_costo_saldo = "";
          fila.porcentaje = "";
          fila.porcentaje_negatividad = "";
        } else {
          fila.metrado = formato(fila.metrado);
          fila.costo_unitario = formato(fila.costo_unitario);
          fila.parcial = formato(fila.parcial);
          fila.avance_metrado = formato(fila.avance_metrado);
          fila.avance_costo = formato(fila.avance_costo);
          fila.metrados_saldo = formato(fila.metrados_saldo);
          fila.metrados_costo_saldo = formato(fila.metrados_costo_saldo);
          fila.porcentaje = Number(formato(fila.porcentaje));
        }
        if (fila.partida_duracion !== "") {
          fila.partida_duracion = fila.partida_duracion * 480;
          if (fila.partida_duracion < 60) {
            fila.partida_duracion = Math.round(fila.partida_duracion) + "m";
          } else if (fila.partida_duracion < 480) {
            const horas = Math.trunc(fila.partida_duracion / 60) + "h";
            const minutos = Math.round(fila.partida_duracion % 60) + "m";
            fila.partida_duracion = horas + " " + minutos;
          } else {
            const dias = Math.trunc(fila.partida_duracion / 480) + "d";
            const residuo_dias = Math.trunc(fila.partida_duracion % 480);
            const horas = Math.trunc(residuo_dias / 60) + "h";
            const minutos = Math.round(residuo_dias % 60) + "m";
            fila.partida_duracion = dias + " " + horas + " " + minutos;
          }
        }
      }

      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getActividadesPNuevas(id_partida) {
    try {
      const query = `/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/
        SELECT partida.id_partida, actividades.id_actividad, actividades.tipo actividad_tipo, historialactividades.estado actividad_estado, actividades.nombre nombre_actividad, actividades.veces veces_actividad, actividades.largo largo_actividad, actividades.ancho ancho_actividad, actividades.alto alto_actividad, actividades.parcial metrado_actividad, partida.costo_unitario, actividades.parcial * partida.costo_unitario parcial_actividad, COALESCE(SUM(avanceactividades.valor), 0) actividad_avance_metrado, COALESCE(SUM(avanceactividades.valor * partida.costo_unitario), 0) actividad_avance_costo, actividades.parcial - COALESCE(SUM(avanceactividades.valor), 0) actividad_metrados_saldo, actividades.parcial * partida.costo_unitario - COALESCE(SUM(avanceactividades.valor * partida.costo_unitario), 0) actividad_metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / actividades.parcial * 100 actividad_porcentaje, TRIM(TRAILING '/DIA' FROM partida.unidad_medida) unidad_medida
        FROM (
          SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor * partidas.costo_unitario) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
          WHERE actividades.parcial > 0 OR partidas.tipo = 'titulo'
          GROUP BY partidas.id_partida
        ) partida
        LEFT JOIN (
          SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo
          FROM partidas
          LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
          WHERE actividades.parcial < 0
          GROUP BY partidas.id_partida
        ) p2 ON p2.id_partida = partida.id_partida
        INNER JOIN actividades ON actividades.Partidas_id_partida = partida.id_partida
        LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
        WHERE historialactividades.estado = 'Partida Nueva' and partida.id_partida = ?
        GROUP BY actividades.id_actividad`;

      const [rows] = await pool.query(query, [id_partida]);

      if (rows.length === 0) {
        return "vacio";
      }

      for (let i = 0; i < rows.length; i++) {
        const fila = rows[i];
        if (fila.actividad_tipo === "titulo") {
          fila.veces_actividad = "";
          fila.largo_actividad = "";
          fila.ancho_actividad = "";
          fila.alto_actividad = "";
          fila.metrado_actividad = "";
          fila.costo_unitario = "";
          fila.parcial_actividad = "";
          fila.actividad_avance_metrado = "";
          fila.actividad_avance_costo = "";
          fila.actividad_metrados_saldo = "";
          fila.actividad_metrados_costo_saldo = "";
          fila.actividad_porcentaje = "";
          fila.unidad_medida = "";
        } else if (fila.parcial_actividad < 0) {
          fila.parcial_actividad = 0;
          fila.actividad_avance_metrado = 0;
          fila.actividad_avance_costo = 0;
          fila.actividad_metrados_saldo = 0;
          fila.actividad_metrados_costo_saldo = 0;
          fila.actividad_porcentaje = 0;
          fila.unidad_medida = 0;
        } else {
          fila.veces_actividad = formato(fila.veces_actividad);
          fila.largo_actividad = formato(fila.largo_actividad);
          fila.ancho_actividad = formato(fila.ancho_actividad);
          fila.alto_actividad = formato(fila.alto_actividad);
          fila.metrado_actividad = formato(fila.metrado_actividad);
          fila.costo_unitario = formato(fila.costo_unitario);
          fila.parcial_actividad = formatoAvance(fila.parcial_actividad);
          fila.actividad_avance_metrado = formato(
            fila.actividad_avance_metrado
          );
          fila.actividad_avance_costo = formatoAvance(
            fila.actividad_avance_costo
          );
          fila.actividad_metrados_saldo = formato(
            fila.actividad_metrados_saldo
          );
          fila.actividad_metrados_costo_saldo = formato(
            fila.actividad_metrados_costo_saldo
          );
          fila.actividad_porcentaje = formato(fila.actividad_porcentaje);
        }
      }

      return rows;
    } catch (error) {
      throw error;
    }
  },
  //recursos
  async getActividadesDuracion(id_ficha) {
    try {
      const query = `
        /******** 02.04.06 Consulta de actividades por tiempo *************/
        SELECT item, descripcion, actividades.nombre nombre_actividad, (parcial / rendimiento) duracion_dia, (parcial / rendimiento) * 480 duracion
        FROM fichas
        LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha
        LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente
        LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida
        WHERE fichas.id_ficha = ? AND (parcial / rendimiento) IS NOT NULL AND (parcial / rendimiento) > 0
        ORDER BY (parcial / rendimiento) ASC
      `;

      const [rows, fields] = await pool.query(query, [id_ficha]);

      if (rows.length === 0) {
        return "vacio";
      }

      for (let i = 0; i < rows.length; i++) {
        const fila = rows[i];

        if (fila.duracion < 60) {
          fila.duracion = formatoAvance(fila.duracion) + "min";
        } else if (fila.duracion < 480) {
          var horas = Math.trunc(fila.duracion / 60) + "h";
          var minutos = formatoAvance(fila.duracion % 60) + "min";
          fila.duracion = horas + " " + minutos;
        } else {
          var dias = Math.trunc(fila.duracion / 480) + "d";
          var residuo_dias = Math.trunc(fila.duracion % 480);
          var horas = Math.trunc(residuo_dias / 60) + "h";
          var minutos = formatoAvance(residuo_dias % 60) + "min";
          fila.duracion = dias + " " + horas + " " + minutos;
        }

        rows[i].duracion_dia = formatoAvance(rows[i].duracion_dia);
      }

      return rows;
    } catch (err) {
      throw err.code;
    }
  },

  async getPrioridades() {
    try {
      const [rows] = await pool.query("SELECT * FROM prioridades");
      if (rows.length === 0) {
        return "vacio";
      } else {
        return rows;
      }
    } catch (error) {
      throw error;
    }
  },
  async getIconoscategorias() {
    try {
      const [rows] = await pool.query("SELECT * FROM iconoscategorias");
      if (rows.length === 0) {
        return "vacio";
      } else {
        return rows;
      }
    } catch (error) {
      throw error;
    }
  },
  async getPartidaComentarios(id_partida) {
    try {
      const query = `
        SELECT
            comentario,
            DATE_FORMAT(partida_comentarios.fecha, '%d-%m-%Y %H:%i') fecha,
            cargos.nombre cargo_nombre,
            '' cargo_imagen,
            accesos.nombre usuario_nombre,
            accesos.id_acceso
        FROM
            partida_comentarios
                LEFT JOIN
            accesos ON accesos.id_acceso = partida_comentarios.id_acceso
                LEFT JOIN
            fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
                LEFT JOIN
            cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
        WHERE
            id_partida = ?
      `;
      const [rows] = await pool.query(query, [id_partida]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async postPartidaComentario(comentario, id_partida, id_acceso) {
    try {
      const query =
        "INSERT INTO partida_comentarios (`comentario`, `id_partida`, `id_acceso`) VALUES (?,?,?);";
      const [result] = await pool.query(query, [
        comentario,
        id_partida,
        id_acceso,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  async getComponenteComentariosNoVistos(id_componente, id_acceso) {
    try {
      const query = `
        SELECT partidas.id_partida, SUM(IF(partida_comentarios_mod.id IS NOT NULL, 1, 0)) mensajes
        FROM partidas
        LEFT JOIN (
          SELECT partida_comentarios.*
          FROM partida_comentarios
          LEFT JOIN partida_comentarios_visto ON partida_comentarios_visto.partida_comentarios_id = partida_comentarios.id AND partida_comentarios_visto.accesos_id = ?
          WHERE partida_comentarios_visto.id IS NULL
        ) partida_comentarios_mod ON partida_comentarios_mod.id_partida = partidas.id_partida
        WHERE partidas.componentes_id_componente = ?
        GROUP BY partidas.id_partida
      `;
      const [rows] = await pool.query(query, [id_acceso, id_componente]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getComentariosNoVistos(id_acceso, id_partida) {
    try {
      const query = `
        SELECT partida_comentarios.*
        FROM partida_comentarios
        LEFT JOIN partida_comentarios_visto ON partida_comentarios_visto.partida_comentarios_id = partida_comentarios.id AND partida_comentarios_visto.accesos_id = ?
        WHERE id_partida = ? AND partida_comentarios_visto.id IS NULL;
      `;
      const [rows] = await pool.query(query, [id_acceso, id_partida]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async postComentariosVistos(data) {
    try {
      const result = await pool.query(
        "INSERT INTO partida_comentarios_visto(accesos_id, partida_comentarios_id) VALUES ?",
        [data]
      );
      return result[0];
    } catch (err) {
      throw err;
    }
  },

  async getComponentesComentarios({ id_acceso, id_componente }) {
    try {
      const result = await pool.query(
        "SELECT componentes.numero, partidas.componentes_id_componente id_componente, SUM(IF(partida_comentarios_mod.id IS NOT NULL, 1, 0)) mensajes FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partida_comentarios.* FROM partida_comentarios LEFT JOIN partida_comentarios_visto ON partida_comentarios_visto.partida_comentarios_id = partida_comentarios.id AND partida_comentarios_visto.accesos_id = ? WHERE partida_comentarios_visto.id IS NULL) partida_comentarios_mod ON partida_comentarios_mod.id_partida = partidas.id_partida WHERE componentes.id_componente = ? AND partidas.componentes_id_componente IS NOT NULL",
        [id_acceso, id_componente]
      );
      return result[0][0] || {};
    } catch (err) {
      throw err;
    }
  },

  async getPartidaComentariosNoVistos(id_acceso, id_partida) {
    try {
      const result = await pool.query(
        "SELECT COUNT(partida_comentarios.id) comentarios_novistos FROM partida_comentarios LEFT JOIN partida_comentarios_visto ON partida_comentarios_visto.partida_comentarios_id = partida_comentarios.id AND partida_comentarios_visto.accesos_id = ? WHERE partida_comentarios.id_partida = ? AND partida_comentarios_visto.id IS NULL",
        [id_acceso, id_partida]
      );
      return result[0][0] || {};
    } catch (err) {
      throw err;
    }
  },

  async getPartidaComentariosTotales({ id_partida }) {
    try {
      const result = await pool.query(
        "SELECT COUNT(partida_comentarios.id) comentarios_total FROM partida_comentarios WHERE partida_comentarios.id_partida = ?",
        [id_partida]
      );
      return result[0][0] || {};
    } catch (err) {
      throw err;
    }
  },
};
