
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

  return fichas;
};
