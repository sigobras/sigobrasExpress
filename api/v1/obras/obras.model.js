const mysql = require("mysql2/promise");
const BaseModel = require("../../libs/baseModel");
const pool = require("../../../config/db.config");

const DB = {};

const buildConditions = (params) => {
  const conditions = [];
  for (const key in params) {
    const newKey =
      key === "id_acceso" && params[key] !== "0" ? "Accesos_id_acceso" : key;
    if (params[key] !== "0" && params[key] !== undefined) {
      conditions.push(`(${newKey} = ${params[key]})`);
    }
  }
  return conditions.length > 0 ? " AND " + conditions.join(" AND ") : "";
};

DB.obtenerTodosPublico = async ({ id_unidadEjecutora, idsectores }) => {
  let query = `
   SELECT
        id_ficha,
        fichas.codigo,
        g_meta,
        codigo_unificado,
        g_total_presu,
        unidadejecutoras.nombre unidad_ejecutora_nombre,
        sectores.nombre sector_nombre,
        fichas_datosautomaticos.presupuesto_costodirecto,
        fichas_datosautomaticos.avancefisico_acumulado,
        fichas_datosautomaticos.avancefinanciero_acumulado,
        DATE_FORMAT(plazo_inicial.fecha_inicio, '%Y-%m-%d') plazoinicial_fecha,
        DATE_FORMAT(plazoaprobado_ultimo.fecha_final,
                '%Y-%m-%d') plazoaprobado_ultimo_fecha,
        DATE_FORMAT(plazosinaprobar_ultimo.fecha_final,
                '%Y-%m-%d') plazosinaprobar_ultimo_fecha,
        estados.nombre estadoobra_nombre,
        estados.color estadoobra_color
    FROM
        fichas
            LEFT JOIN
        fichas_datosautomaticos ON fichas_datosautomaticos.fichas_id_ficha = fichas.id_ficha
            LEFT JOIN
        plazos_historial plazo_inicial ON plazo_inicial.id = fichas_datosautomaticos.plazoaprobado_inicial
            LEFT JOIN
        plazos_historial plazoaprobado_ultimo ON plazoaprobado_ultimo.id = fichas_datosautomaticos.plazoaprobado_ultimo
            LEFT JOIN
        plazos_historial plazosinaprobar_ultimo ON plazosinaprobar_ultimo.id = fichas_datosautomaticos.plazosinaprobar_ultimo
            LEFT JOIN
        historialestados ON historialestados.id_historialEstado = fichas_datosautomaticos.estado_obra
            LEFT JOIN
        estados ON estados.id_Estado = historialestados.Estados_id_Estado
            LEFT JOIN
        unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
            LEFT JOIN
        sectores ON sectores.idsectores = fichas.sectores_idsectores
    WHERE
        estado_publico
    `;
  query += buildConditions({ id_unidadEjecutora, idsectores });
  query += `
    ORDER BY unidadejecutoras.poblacion desc , sectores_idsectores
  `;
  const [rows] = await pool.query(query);
  return rows;
};
DB.obtenerTodos = async (params) => {
  const { id, sort_by, textoBuscado, ...rest } = params;

  let query = `
       SELECT
            id_ficha,
            fichas.codigo,
            g_meta,
            codigo_unificado,
            g_total_presu,
            unidadejecutoras.nombre unidad_ejecutora_nombre,
            unidadejecutoras.poblacion,
            sectores.nombre sector_nombre,
            fichas_datosautomaticos.presupuesto_costodirecto,
            fichas_datosautomaticos.avancefisico_acumulado,
            fichas_datosautomaticos.avancefinanciero_acumulado,
            DATE_FORMAT(fichas_datosautomaticos.avancefisico_ultimafecha, '%Y-%m-%d') avancefisico_ultimafecha,
            DATE_FORMAT(plazo_inicial.fecha_inicio, '%Y-%m-%d') plazoinicial_fecha,
            DATE_FORMAT(plazo_inicial.fecha_final, '%Y-%m-%d') plazoinicial_fechafinal,
            DATE_FORMAT(plazoaprobado_ultimo.fecha_final,
                    '%Y-%m-%d') plazoaprobado_ultimo_fecha,
            DATE_FORMAT(plazosinaprobar_ultimo.fecha_final,
                    '%Y-%m-%d') plazosinaprobar_ultimo_fecha,
            estados.nombre estadoobra_nombre,
            estados.color estadoobra_color,
            datos_anuales.pim pim_anyoactual,
            datos_anuales.meta meta_anyoactual,
            DATE_FORMAT(MAX(curva_s.fecha_inicial), '%Y-%m-%d') programado_ultima_fecha,
            DATE_FORMAT(MAX(curva_s.financiero_fecha_update),
                '%Y-%m-%d') financiero_ultima_fecha,
            eo.id id_expediente
        FROM
            fichas
            LEFT JOIN expedientes_obra eo ON eo.ficha_id = fichas.id_ficha
                LEFT JOIN
            fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
                LEFT JOIN
            datos_anuales ON datos_anuales.fichas_id_ficha = fichas.id_ficha
                AND datos_anuales.anyo = 2021
                LEFT JOIN
            curva_s ON curva_s.fichas_id_ficha = fichas.id_ficha
                LEFT JOIN
            fichas_datosautomaticos ON fichas_datosautomaticos.fichas_id_ficha = fichas.id_ficha
                LEFT JOIN
            plazos_historial plazo_inicial ON plazo_inicial.id = fichas_datosautomaticos.plazoaprobado_inicial
                LEFT JOIN
            plazos_historial plazoaprobado_ultimo ON plazoaprobado_ultimo.id = fichas_datosautomaticos.plazoaprobado_ultimo
                LEFT JOIN
            plazos_historial plazosinaprobar_ultimo ON plazosinaprobar_ultimo.id = fichas_datosautomaticos.plazosinaprobar_ultimo
                LEFT JOIN
            historialestados ON historialestados.id_historialEstado = fichas_datosautomaticos.estado_obra
                LEFT JOIN
            estados ON estados.id_Estado = historialestados.Estados_id_Estado
                LEFT JOIN
            unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
                LEFT JOIN
            sectores ON sectores.idsectores = fichas.sectores_idsectores
        WHERE
            fichas_has_accesos.habilitado AND eo.id = (
              SELECT MAX(id)
              FROM expedientes_obra
              WHERE ficha_id = fichas.id_ficha
          ) 
    `;
  if (textoBuscado != "" && textoBuscado != undefined) {
    query += ` AND (g_meta like \'%${textoBuscado}%\' OR fichas.codigo like \'%${textoBuscado}%\')`;
  }
  query += buildConditions(rest);
  query += `
      GROUP BY fichas.id_ficha
    `;
  if (sort_by) {
    const sort_byData = sort_by.split("-");
    query += ` ORDER BY ${sort_byData[0]} ${sort_byData[1]}`;
  }
  const [rows] = await pool.query(query);
  return id ? rows[0] : rows;
};
DB.obtenerTodosResumen = async (params) => {
  const { sort_by, ...rest } = params;
  let query = `
        SELECT
            id_ficha,
            fichas.codigo,
            g_total_presu presupuesto,
            estados.nombre estado_obra,
            meta,
            g_meta nombre_obra,
            codigo_sial,
            codigo_unificado codigo_ui,
            g_snip codigo_snip,
            codigo_infobras,
            g_func funcion,
            division_funcional,
            g_subprog subprograma,
            fecha_inaguracion,
            presupuesto_costodirecto,
            avancefisico_acumulado,
            avancefinanciero_acumulado,
            unidadejecutoras.nombre unidad_ejecutora_nombre,
            sectores.nombre sector_nombre
        FROM
            fichas
                LEFT JOIN
            fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
                LEFT JOIN
            fichas_datosautomaticos ON fichas_datosautomaticos.fichas_id_ficha = fichas.id_ficha
                LEFT JOIN
            historialestados ON historialestados.id_historialEstado = fichas_datosautomaticos.estado_obra
                LEFT JOIN
            estados ON estados.id_Estado = historialestados.Estados_id_Estado
                LEFT JOIN
            unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
                LEFT JOIN
            sectores ON sectores.idsectores = fichas.sectores_idsectores
        WHERE
            Accesos_id_acceso = ${id_acceso}
    `;
  query += buildConditions(rest);
  if (sort_by) {
    const sort_byData = sort_by.split("-");
    query += ` ORDER BY ${sort_byData[0]} ${sort_byData[1]}`;
  }
  const [rows] = await pool.query(query);
  return rows;
};
DB.actualizarDatos = async (params) => {
  const { id, codigo_snip, funcion, division_funcional, subprograma } = params;
  const query = BaseModel.update(
    "fichas",
    {
      g_snip: codigo_snip,
      g_func: funcion,
      division_funcional,
      g_subprog: subprograma,
    },
    [`id_ficha = ${id}`]
  );
  const [result] = await pool.query(query);
  return result;
};
module.exports = DB;
