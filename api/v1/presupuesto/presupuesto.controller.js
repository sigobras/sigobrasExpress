const Model = require("./presupuesto.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function actualizarPresupuesto(data) {
  return Model.actualizarPresupuesto(data);
}
module.exports = {
  obtenerTodos,
  actualizarPresupuesto,
};
