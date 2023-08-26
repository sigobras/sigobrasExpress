const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/sequelizeConfig");

const Actividades = sequelize.define(
  "actividades",
  {
    id_actividad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      unique: true,
    },
    veces: DataTypes.STRING,
    largo: DataTypes.STRING,
    ancho: DataTypes.STRING,
    alto: DataTypes.STRING,
    parcial: DataTypes.DECIMAL(20, 6),
    tipo: DataTypes.STRING,
    Partidas_id_partida: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "actividades",
    timestamps: false,
  }
);

module.exports = Actividades;
