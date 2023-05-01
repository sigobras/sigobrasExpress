const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/sequelizeConfig");

const reporte_monitoreo_seguimiento = sequelize.define(
  "reporte_monitoreo_seguimiento",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    provincias: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coordinadores_1ra: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coordinadores_2da: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coordinadores_3ra: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cui: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nombre_proyecto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profesion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_asignacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    celular: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condicion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nombre_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dni_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    celular_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    correo_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condicion_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nombre_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    celular_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nombre_3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    celular_3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expediente: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    presupuesto_total: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    acumulado_ejecutado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pia_2023: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modif: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pim: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_certificado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avance_fisico_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avance_financiero_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avance_fisico_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avance_financiero_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    plazo_ejecucion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_reinicio_obra: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ampliaciones_plazo_tramitadas: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_culminacion_nuevo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    documentacion_reinicio_obra: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    informe_corte_residente_saliente: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    informe_corte_residente_entrante: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    asignacion_presupuestal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modificacion_analitico: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modificacion_expediente_tecnico: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ampliacion_presupuestal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    presentacion_tareos: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    informe_mensual: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monto_proceso_seleccion_soles: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    proceso_seleccion_convocados_ultimahor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monto_adquisicion_directa_soles: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monto_total_soles: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    conformidad_bienes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    conformidad_servicio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seguimiento_obras_2023_02_27: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seguimiento_obras_2023_03_06: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seguimiento_obras_2023_03_13: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    problematica_reinicio_obra: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cemento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cantidad_cemento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_vencimiento_cemento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cantidad_vencidos_cemento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_vencimiento_cemento_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avance_fisico_porcentaje: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    restricciones_para_no_llegar_al_100: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "reporte_monitoreo_seguimiento",
    timestamps: false, // esto evita que se creen campos `createdAt` y `updatedAt`
  }
);

module.exports = reporte_monitoreo_seguimiento;
