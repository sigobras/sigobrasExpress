const Sequelize = require('sequelize');
const sequelize = require("../../../config/sequelizeConfig");

const personalNoTecnico = require('../personalNoTecnico/model')(sequelize, Sequelize);
const Cargos_Obreros = require('../cargosNoTecnicos/model')(sequelize, Sequelize);
const fichas = require('../fichas/model')(sequelize, Sequelize);
const asignacion = require('../asignacionPersonalNoTecnico/model')(sequelize, Sequelize);

// Define associations here

personalNoTecnico.hasMany(asignacion,{
  foreignKey: 'id_personal_no_tecnico',
    as: 'asignacion'
});
asignacion.belongsTo(personalNoTecnico,{
  foreignKey: 'id_personal_no_tecnico',
    as: 'personalNoTecnico'
});

module.exports = {
  personalNoTecnico,
  Cargos_Obreros,
  fichas,
  asignacion
};

