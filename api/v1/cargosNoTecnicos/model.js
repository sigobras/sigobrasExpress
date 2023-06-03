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

  // Cargos_Obreros.hasMany(asignacion, { foreignKey: "id_cargos_obreros" });
  return Cargos_Obreros;
};
