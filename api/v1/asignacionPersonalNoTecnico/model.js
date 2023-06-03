const { personalNoTecnico, Cargos_Obreros, fichas } = require("../models");

module.exports = (sequelize, { DataTypes }) => {
  const Asignacion = sequelize.define(
    "asignacion",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_personal_no_tecnico: { type: DataTypes.INTEGER },
      id_ficha: { type: DataTypes.INTEGER },
      id_cargos_obreros: { type: DataTypes.INTEGER },
    },
    {
      tableName: "asignacion",
      timestamps: false,
    }
  );
  // Asignacion.belongsTo(personalNoTecnico)

  return Asignacion;
};
