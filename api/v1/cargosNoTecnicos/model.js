module.exports = (sequelize, { DataTypes }) => {
  const cargosObreros = sequelize.define(
    "cargosObreros",
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
  return cargosObreros;
};
