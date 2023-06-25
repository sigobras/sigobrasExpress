const pool = require("../../../../../config/db.config");

const getAnyosEjecutados = async (id_ficha) => {
  try {
    const res = await pool.query(
      'SELECT YEAR(avanceactividades.fecha) AS anyo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND fichas.id_ficha = ? AND estados.codigo != "A" AND COALESCE(avanceactividades.valor, 0) != 0 AND YEAR(avanceactividades.fecha) NOT IN (SELECT YEAR(curva_s.fecha_inicial) anyo FROM curva_s WHERE fichas_id_ficha = ? GROUP BY YEAR(curva_s.fecha_inicial)) GROUP BY YEAR(avanceactividades.fecha) ORDER BY YEAR(avanceactividades.fecha)',
      [id_ficha, id_ficha]
    );
    return res[0];
  } catch (error) {
    throw error;
  }
};

const getPeriodosEjecutados = async (anyo, id_ficha) => {
  try {
    const res = await pool.query(
      'SELECT estados.codigo AS estado_codigo, MIN(DATE_FORMAT(avanceactividades.fecha, "%Y-%m-%d")) AS fecha_inicial, MIN(DATE_FORMAT(avanceactividades.fecha, "%Y-%m")) AS anyoMes, MIN(DATE_FORMAT(avanceactividades.fecha, "%m")) AS mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND fichas.id_ficha = ? AND (YEAR(avanceactividades.fecha) = ?) AND estados.codigo != "A" AND COALESCE(avanceactividades.valor, 0) != 0 GROUP BY historialestados.id_historialEstado, DATE_FORMAT(avanceactividades.fecha, "%Y-%b") ORDER BY avanceactividades.fecha',
      [id_ficha, anyo]
    );
    return res[0];
  } catch (error) {
    throw error;
  }
};

const postDataCurvaS = async (data) => {
  try {
    const res = await pool.query(
      "INSERT INTO curva_s (fecha_inicial, fisico_programado_monto, financiero_monto, fisico_monto, observacion, estado_codigo, fichas_id_ficha, tipo, anyo, mes) VALUES ?",
      [data]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const getDataCurvaS = async ({ id_ficha, anyo }) => {
  try {
    let query = `SELECT * FROM curva_s WHERE fichas_id_ficha = ${id_ficha}`;
    const condiciones = [];
    if (anyo != 0 && anyo != undefined) {
      condiciones.push(`(anyo = ${anyo})`);
    }
    if (condiciones.length) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += " ORDER BY fecha_inicial";
    const res = await pool.query(query);
    await pool.query(
      `UPDATE fichas_datosautomaticos SET avancefinanciero_acumulado = (SELECT SUM(financiero_monto) avancefisico_acumulado FROM curva_s WHERE fichas_id_ficha = ${id_ficha} AND curva_s.tipo = "PERIODO") WHERE fichas_id_ficha = ${id_ficha}`
    );
    return res[0];
  } catch (error) {
    throw error;
  }
};

const getDataCurvaSAnyos = async (id_ficha) => {
  try {
    const query = `SELECT anyo FROM curva_s WHERE fichas_id_ficha = ${id_ficha} GROUP BY anyo ORDER BY anyo DESC`;
    const res = await pool.query(query);
    return res ? res[0] : [];
  } catch (error) {
    throw error;
  }
};

const getDataCurvaSAcumulados = async (id_ficha, anyo) => {
  try {
    const query = `SELECT SUM(curva_s.fisico_programado_monto) AS programado_acumulado, SUM(curva_s.fisico_monto) AS ejecutado_acumulado, SUM(curva_s.financiero_monto) AS financiero_acumulado FROM curva_s WHERE fichas_id_ficha = ${id_ficha} AND anyo <= ${anyo}`;
    const res = await pool.query(query);
    return res ? res[0] : {};
  } catch (error) {
    throw error;
  }
};

const getDataCurvaSAcumuladosByAnyo = async (id_ficha, anyo) => {
  try {
    const query = `SELECT anyo, SUM(curva_s.fisico_programado_monto) AS fisico_programado_monto, SUM(curva_s.fisico_monto) AS fisico_monto, SUM(curva_s.financiero_programado_monto) AS financiero_programado_monto, SUM(curva_s.financiero_monto) AS financiero_monto, "TOTAL" AS tipo FROM curva_s WHERE fichas_id_ficha = ${id_ficha} AND anyo < ${anyo} GROUP BY anyo`;
    const res = await pool.query(query);
    return res;
  } catch (error) {
    throw error;
  }
};

const getDataCurvaSAcumuladosByAnyo2 = async (id_ficha, anyo) => {
  try {
    const query = `SELECT anyo, SUM(curva_s.fisico_programado_monto) AS fisico_programado_monto, SUM(curva_s.fisico_monto) AS fisico_monto, SUM(curva_s.financiero_monto) AS financiero_monto, "TOTAL" AS tipo FROM curva_s WHERE fichas_id_ficha = ${id_ficha} AND anyo = ${anyo} GROUP BY anyo`;
    const res = await pool.query(query);
    return res ? res[0] : {};
  } catch (error) {
    throw error;
  }
};

const getMontoEjecutadoPeriodo = async (
  fecha_inicial,
  fecha_final,
  id_ficha
) => {
  try {
    const res = await pool.query(
      "SELECT SUM(valor) AS ejecutado_monto FROM (SELECT partidas.id_partida, CAST(SUM(avanceactividades.valor) AS DECIMAL(20, 10)) * costo_unitario AS valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado IS NULL AND componentes.fichas_id_ficha = ? GROUP BY partidas.id_partida) periodo",
      [fecha_inicial, fecha_final, id_ficha]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const getRegistrosAnyoCurvaS = async (fecha_inicial, id_ficha) => {
  try {
    const res = await pool.query(
      "SELECT id FROM curva_s WHERE YEAR(fecha_inicial) = ? AND fichas_id_ficha = ?",
      [fecha_inicial, id_ficha]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const putFinancieroCurvaS = async (
  id,
  financiero_monto,
  ultimo_editor_idacceso
) => {
  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const financiero_fecha_update = `${yyyy}-${mm}-${dd}`;
    const res = await pool.query(
      "UPDATE curva_s SET financiero_monto = ?, ultimo_editor_idacceso = ?, financiero_fecha_update = ? WHERE id = ?",
      [financiero_monto, ultimo_editor_idacceso, financiero_fecha_update, id]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const putFinancieroProgramadoCurvaS = async (
  id,
  financiero_programado_monto,
  ultimo_editor_idacceso
) => {
  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const financiero_fecha_update = `${yyyy}-${mm}-${dd}`;
    const res = await pool.query(
      "UPDATE curva_s SET financiero_programado_monto = ?, ultimo_editor_idacceso = ?, financiero_fecha_update = ? WHERE id = ?",
      [
        financiero_programado_monto,
        ultimo_editor_idacceso,
        financiero_fecha_update,
        id,
      ]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const putProgramadoCurvaSbyId = async (id, programado_monto) => {
  try {
    const res = await pool.query(
      "UPDATE curva_s SET fisico_programado_monto = ? WHERE id = ?",
      [programado_monto, id]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const getFechaFinalCurvaS = async (fecha_inicial, id_ficha) => {
  try {
    const res = await pool.query(
      'SELECT DATE_FORMAT(fecha_inicial, "%Y-%m-%d") AS fecha_final FROM curva_s WHERE curva_s.fecha_inicial > ? AND curva_s.fichas_id_ficha = ? ORDER BY fecha_inicial LIMIT 1',
      [fecha_inicial, id_ficha]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const putEjecutadoCurvaS = async (ejecutado_monto, fecha_inicial, id_ficha) => {
  try {
    const res = await pool.query(
      "UPDATE curva_s SET ejecutado_monto = ? WHERE fecha_inicial = ? AND fichas_id_ficha = ?",
      [ejecutado_monto, fecha_inicial, id_ficha]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const putProgramadoCurvaS = async (
  programado_monto,
  fecha_inicial,
  id_ficha
) => {
  try {
    const res = await pool.query(
      "UPDATE curva_s SET programado_monto = ? WHERE fecha_inicial = ? AND fichas_id_ficha = ?",
      [programado_monto, fecha_inicial, id_ficha]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const getRegistroNoUbicados = async (id_ficha) => {
  try {
    const res = await pool.query(
      "SELECT COUNT(avanceactividades.id_AvanceActividades) AS registros FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas_id_ficha = ? AND COALESCE(avanceactividades.valor, 0) != 0 AND avanceactividades.fecha < (SELECT MIN(fecha_inicial) AS fecha_inicial FROM historialestados WHERE Fichas_id_ficha = ?)",
      [id_ficha, id_ficha]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const getAnyosNoRegistradosCurvaS = async (id_ficha) => {
  try {
    const res = await pool.query(
      'SELECT YEAR(avanceactividades.fecha) AS anyo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND fichas.id_ficha = ? AND estados.codigo != "A" AND COALESCE(avanceactividades.valor, 0) != 0 AND YEAR(avanceactividades.fecha) NOT IN (SELECT YEAR(curva_s.fecha_inicial) AS anyo FROM curva_s WHERE fichas_id_ficha = ? GROUP BY YEAR(curva_s.fecha_inicial)) GROUP BY YEAR(avanceactividades.fecha) ORDER BY YEAR(avanceactividades.fecha)',
      [id_ficha, id_ficha]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const getDataObra = async (id_ficha) => {
  try {
    const res = await pool.query(
      "SELECT id_ficha, fichas.g_total_presu, SUM(componentes.presupuesto) AS costo_directo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha WHERE componentes.fichas_id_ficha = ?",
      [id_ficha]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const deletePeriodoCurvaS = async (id) => {
  try {
    const res = await pool.query("DELETE FROM curva_s WHERE id = ?", [id]);
    return res;
  } catch (error) {
    throw error;
  }
};

const getPimData = async (id_ficha) => {
  try {
    const query = `SELECT datos_anuales.*, fichas_id_ficha AS id_ficha FROM datos_anuales WHERE fichas_id_ficha = ${id_ficha}`;
    const res = await pool.query(query);
    return res;
  } catch (error) {
    throw error;
  }
};

const getCurvaSPin = async (id_ficha, anyo) => {
  try {
    const results = await pool.query(
      "SELECT * FROM datos_anuales WHERE fichas_id_ficha = ? AND anyo = ?;",
      [id_ficha, anyo]
    );
    return results ? results[0] : {};
  } catch (error) {
    throw error;
  }
};

const postCurvaSPin = async (data) => {
  try {
    const res = await pool.query(
      "INSERT INTO datos_anuales (fichas_id_ficha, anyo, pim) VALUES ? ON DUPLICATE KEY UPDATE pim = VALUES(pim)",
      [data]
    );
    return res;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAnyosEjecutados,
  getPeriodosEjecutados,
  postDataCurvaS,
  getDataCurvaS,
  getDataCurvaSAnyos,
  getDataCurvaSAcumulados,
  getDataCurvaSAcumuladosByAnyo,
  getDataCurvaSAcumuladosByAnyo2,
  getMontoEjecutadoPeriodo,
  getRegistrosAnyoCurvaS,
  putFinancieroCurvaS,
  putFinancieroProgramadoCurvaS,
  putProgramadoCurvaSbyId,
  getFechaFinalCurvaS,
  putEjecutadoCurvaS,
  putProgramadoCurvaS,
  getRegistroNoUbicados,
  getAnyosNoRegistradosCurvaS,
  getDataObra,
  deletePeriodoCurvaS,
  getPimData,
  getCurvaSPin,
  postCurvaSPin,
};
