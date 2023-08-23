const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/sequelizeConfig");

const Partidas = sequelize.define(
  "partidas",
  {
    id_partida: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unidad_medida: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metrado: {
      type: DataTypes.DECIMAL(20, 7),
      allowNull: false,
    },
    costo_unitario: {
      type: DataTypes.DECIMAL(20, 7),
      allowNull: false,
    },
    equipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rendimiento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prioridad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    componentes_id_componente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iconosCategorias_id_iconoCategoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prioridades_id_prioridad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    iconoscategoriasrecursos_id_iconoscategoriasrecurso: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prioridadesRecursos_id_prioridadesRecurso: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "partidas",
    timestamps: false, // Si no necesitas timestamps, puedes omitir esta línea
  }
);

module.exports = Partidas;
