const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelizeConfig'); // Reemplaza '../config/database' con la ubicación correcta de tu archivo de configuración de Sequelize

const Componente = sequelize.define('Componente', {
  id_componente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  presupuesto: {
    type: DataTypes.DECIMAL(20, 7),
    allowNull: false
  },
  expediente_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'componentes',
  timestamps: false // Si no necesitas timestamps, puedes omitir esta línea
});

module.exports = Componente;
