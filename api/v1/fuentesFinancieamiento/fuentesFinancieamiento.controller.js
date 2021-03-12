const Model = require("./fuentesFinancieamiento.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function actualizarDatosLista(data) {
  return Model.actualizarDatosLista(data);
}
function eliminarById(data) {
  return Model.eliminarById(data);
}
function obtenerTodosFuentesFinanaciamiento(data) {
  return Model.obtenerTodosFuentesFinanaciamiento(data);
}
function obtenerTodosCostos(data) {
  return Model.obtenerTodosCostos(data);
}
function obtenerTodosEspecificas(data) {
  return Model.obtenerTodosEspecificas(data);
}
function ingresarEspecifica(data) {
  return Model.ingresarEspecifica(data);
}
function actualizarEspecificaById(data) {
  return Model.actualizarEspecificaById(data);
}
function actualizarAvanceMensual(data) {
  return Model.actualizarAvanceMensual(data);
}
function actualizarCostos(data) {
  return Model.actualizarCostos(data);
}
function eliminarCostosById(data) {
  return Model.eliminarCostosById(data);
}
function eliminarEspecificaById(data) {
  return Model.eliminarEspecificaById(data);
}
module.exports = {
  obtenerTodos,
  actualizarDatosLista,
  eliminarById,
  obtenerTodosFuentesFinanaciamiento,
  obtenerTodosCostos,
  obtenerTodosEspecificas,
  ingresarEspecifica,
  actualizarEspecificaById,
  actualizarAvanceMensual,
  actualizarCostos,
  eliminarCostosById,
  eliminarEspecificaById,
};
