const { asignacion } = require("../models");

module.exports = (sequelize, { DataTypes }) => {
  const fichas = sequelize.define(
    "fichas",
    {
      id_ficha: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: { type: DataTypes.STRING(25) },
    },
    { timestamps: false }
  );

  // fichas.hasMany(asignacion, { foreignKey: "id_ficha" });
  return fichas;
};
