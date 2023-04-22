const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'mysql',
  // Establecer el límite de conexiones para que coincida con tu configuración actual
  pool: {
    max: 200,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;