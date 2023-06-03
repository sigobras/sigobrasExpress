module.exports = (sequelize, { DataTypes }) => {
  const PersonalNoTecnico = sequelize.define(
    "personal_no_tecnico",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombres: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      apellido_paterno: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      apellido_materno: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      dni: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
      },
      telefono: {
        type: DataTypes.STRING(10),
      },
      fecha_nacimiento: {
        type: DataTypes.DATE,
      },
      direccion: {
        type: DataTypes.STRING(45),
      },
      celular: {
        type: DataTypes.STRING(9),
      },
      email: {
        type: DataTypes.STRING(50),
      },
    },
    { tableName: "personal_no_tecnico", timestamps: false }
  );

  return PersonalNoTecnico;
};
