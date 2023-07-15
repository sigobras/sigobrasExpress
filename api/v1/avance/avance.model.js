const DB = {};
const queryBuilder = require("../../libs/queryBuilder");

DB.obtenerAvanceByComponente = async ({ id_componente }) => {
  try {
    const query = `
      SELECT
          SUM(avanceactividades.valor * partidas.costo_unitario) avance
      FROM
          partidas
              LEFT JOIN
          actividades ON actividades.Partidas_id_partida = partidas.id_partida
              LEFT JOIN
          avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
      WHERE
          partidas.componentes_id_componente = ${id_componente}
    `;

    const [results] = await pool.query(query);
    return results ? results[0] : {};
  } catch (err) {
    throw err;
  }
};

DB.obtenerAvanceResumenAnual = async ({ id_ficha, anyo }) => {
  try {
    const query = `
      SELECT
          mes, fisico_monto, fisico_programado_monto
      FROM
          curva_s
      WHERE
          anyo = ${anyo} AND fichas_id_ficha = ${id_ficha}
    `;

    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    throw err;
  }
};

DB.obtenerAvanceAcumuladoAnual = async ({ id_ficha, anyo }) => {
  try {
    const query = `
      SELECT
          SUM(fisico_monto) fisico_monto,
          SUM(financiero_monto) financiero_monto
      FROM
          curva_s
      WHERE
          anyo <= ${anyo} AND fichas_id_ficha = ${id_ficha}
    `;

    const [results] = await pool.query(query);
    return results ? results[0] : {};
  } catch (err) {
    throw err;
  }
};

DB.obtenerValorizacionPartidas = async ({ id_ficha, anyo }) => {
  try {
    const query = `
      SELECT
          SUM(fisico_monto) fisico_monto,
          SUM(financiero_monto) financiero_monto
      FROM
          curva_s
      WHERE
          anyo <= ${anyo} AND fichas_id_ficha = ${id_ficha}
    `;

    const [results] = await pool.query(query);
    return results ? results[0] : {};
  } catch (err) {
    throw err;
  }
};

DB.avanceMetrados = async ({ id_componente, anyo, mes, id_partidas }) => {
  try {
    const condiciones = [];
    if (id_partidas) {
      condiciones.push(`partidas.id_partida IN (${id_partidas})`);
    }

    const query = new queryBuilder("partidas")
      .select([`SUM(avanceactividades.valor) metrado_anterior`])
      .leftJoin(`
        actividades
        LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        AND avanceactividades.fecha < "${anyo}-${mes}-01"
      `)
      .where([`componentes_id_componente = ${id_componente}`].concat(condiciones))
      .groupBy(`partidas.id_partida`)
      .toString();

    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    throw err;
  }
};

DB.obtenerRecursosNombres = async ({ id_componente, anyo, mes, id_partidas }) => {
  try {
    const query = new queryBuilder("partidas")
      .select([`recursos.descripcion`])
      .innerJoin(`
        recursos ON recursos.Partidas_id_partida = partidas.id_partida
        AND recursos.tipo = 'Mano de Obra'
      `)
      .where([`partidas.id_partida IN (${id_partidas})`])
      .groupBy(`recursos.descripcion`)
      .toString();

    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    throw err;
  }
};

DB.recursosParcial = async ({ id_partidas, recursos_nombres }) => {
  try {
    const condiciones = recursos_nombres.map(element => {
      return `
        SUM(IF(recursos.descripcion = '${element.descripcion}',
          recursos.parcial,
          0)) recurso_${element.descripcion.replace(/ /g, "_")}
      `;
    });

    const query = new queryBuilder("partidas")
      .select(condiciones)
      .leftJoin(`recursos ON recursos.Partidas_id_partida = partidas.id_partida`)
      .where([`partidas.id_partida IN (${id_partidas})`])
      .groupBy(`partidas.id_partida`)
      .toString();

    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    throw err;
  }
};

DB.obtenerCuadroMetrados = async ({ id_componente, anyo, mes }) => {
  try {
    const date = new Date(anyo, mes, 0);
    const ultimoDia = date.getDate();
    const cols = [];
    for (let index = 1; index <= ultimoDia; index++) {
      cols.push(`
        SUM(IF(DAY(avanceactividades.fecha) = ${index},
          valor,
          0)) dia_${index}
      `);
    }

    const query = new queryBuilder("partidas")
      .select([
        `partidas.id_partida`,
        `partidas.item`,
        `partidas.descripcion`,
        `partidas.unidad_medida`,
        `partidas.metrado`,
        `partidas.tipo`,
      ].concat(cols))
      .leftJoin(`
        actividades
        LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        AND YEAR(avanceactividades.fecha) = ${anyo}
        AND MONTH(avanceactividades.fecha) = ${mes}
      `)
      .where([`componentes_id_componente = ${id_componente}`])
      .groupBy(`partidas.id_partida`)
      .toString();

    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    throw err;
  }
};

DB.obtenerCuadroMetradosResumen = async ({ id_componente, anyo, mes }) => {
  try {
    const date = new Date(anyo, mes, 0);
    const ultimoDia = date.getDate();
    const cols = [];
    for (let index = 1; index <= ultimoDia; index++) {
      cols.push(`
        SUM(IF(DAY(avanceactividades.fecha) = ${index},
          valor,
          0)) dia_${index}
      `);
    }

    const query = new queryBuilder("partidas")
      .select([
        `partidas.id_partida`,
        `partidas.item`,
        `partidas.descripcion`,
        `partidas.unidad_medida`,
        `partidas.metrado`,
        `partidas.tipo`,
      ].concat(cols))
      .leftJoin(`
        actividades
        INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
      `)
      .where([
        `componentes_id_componente = ${id_componente}`,
        `YEAR(avanceactividades.fecha) = ${anyo}`,
        `MONTH(avanceactividades.fecha) = ${mes}`,
        `avanceactividades.fecha > 0`,
        `avanceactividades.valor IS NOT NULL`,
      ])
      .groupBy(`partidas.id_partida`)
      .toString();

    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    throw err;
  }
};

DB.eliminarImagen = async ({ id }) => {
  try {
    const query = new queryBuilder("avanceactividades")
      .update({
        imagen: null,
      })
      .tipoNull(true)
      .where([`id_AvanceActividades = ${id}`])
      .toString();

    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    throw err;
  }
};

DB.obtenerData = async ({ id }) => {
  try {
    const query = new queryBuilder("actividades")
      .select([
        "avanceactividades.*",
        ["fecha", "fecha", "date"],
        ["fecha_registro", "fecha_registro", "date"],
      ])
      .leftJoin(`avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad`)
      .where([`Partidas_id_partida = ${id}`])
      .toString();

    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    throw err;
  }
};

DB.actualizar = async ({ id, valor }) => {
  try {
    const query = new queryBuilder("avanceactividades")
      .update({ valor })
      .where([`id_AvanceActividades = ${id}`])
      .toString();

    const [results] = await pool.query(query);
    return results;
  } catch (err) {
    throw err;
  }
};

module.exports = DB;
