const Sequelize = require("sequelize");
const sequelize = require("../../../config/sequelizeConfig");

const personalNoTecnico = require("../personalNoTecnico/model")(
  sequelize,
  Sequelize
);
const cargosObreros = require("../cargosNoTecnicos/model")(
  sequelize,
  Sequelize
);
const fichas = require("../fichas/model")(sequelize, Sequelize);
const asignacion = require("../asignacionPersonalNoTecnico/model")(
  sequelize,
  Sequelize
);

const historialPersonalNoTecnico =
  require("../historialPersonalNoTecnico/model")(sequelize, Sequelize);

// Define associations here

personalNoTecnico.hasMany(asignacion, {
  foreignKey: "id_personal_no_tecnico",
  as: "asignacion",
});
asignacion.belongsTo(personalNoTecnico, {
  foreignKey: "id_personal_no_tecnico",
  as: "personalNoTecnico",
});

asignacion.belongsTo(cargosObreros, {
  foreignKey: "id_cargos_obreros",
  as: "cargos_obreros",
});
cargosObreros.hasMany(asignacion, {
  foreignKey: "id_cargos_obreros",
  as: "asignacion",
});

historialPersonalNoTecnico.belongsTo(asignacion, {
  foreignKey: "id_asignacion",
  as: "asignacion",
});
asignacion.hasMany(historialPersonalNoTecnico, {
  foreignKey: "id",
  as: "historial_personal_no_tecnico",
});


module.exports = {
  personalNoTecnico,
  cargosObreros,
  fichas,
  asignacion,
  historialPersonalNoTecnico,
};
