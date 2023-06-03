const { asignacion } = require("../models");
module.exports = (sequelize, { DataTypes }) => {
  const Cargos_Obreros = sequelize.define(
    "Cargos_Obreros",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(25),
      },
    },
    {
      tableName: "cargos_obreros",
      timestamps: false,
    }
  );
  return Cargos_Obreros;
};
