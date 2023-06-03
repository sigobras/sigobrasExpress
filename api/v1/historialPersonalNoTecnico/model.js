const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/sequelizeConfig");

const HistorialPersonalNoTecnico = sequelize.define(
  "historial_personal_no_tecnico",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    dias_trabajados: { type: DataTypes.INTEGER(3) },
    mes_ano: { type: DataTypes.DATE },
    id_asignacion: { type: DataTypes.INTEGER },
  },
  {
    tableName: "historial_personal_no_tecnico",
    timestamps: false,
  }
);

module.exports = HistorialPersonalNoTecnico;
