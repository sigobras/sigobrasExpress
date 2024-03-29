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
function obtenerTodosEspecificasVariacionesPim(data) {
  return Model.obtenerTodosEspecificasVariacionesPim(data);
}
function obtenerTodosEspecificasVariacionesPimMonto(data) {
  return Model.obtenerTodosEspecificasVariacionesPimMonto(data);
}
function guardarVariacionesPim(data) {
  return Model.guardarVariacionesPim(data);
}
function actualizarVariacionesPim(data) {
  return Model.actualizarVariacionesPim(data);
}
function eliminarVariacionesPim(data) {
  return Model.eliminarVariacionesPim(data);
}
function actualizarVariacionesPimMonto(data) {
  return Model.actualizarVariacionesPimMonto(data);
}
function asignarCosto(data) {
  return Model.asignarCosto(data);
}
function getDataParaActualizarAvanceMensual(data) {
  return Model.getDataParaActualizarAvanceMensual(data);
}
function getMontoParaActualizarAvanceMensual(data) {
  return Model.getMontoParaActualizarAvanceMensual(data);
}
function predecirFuenteFinanciamiento(data) {
  return Model.predecirFuenteFinanciamiento(data);
}
function obtenerDataById(data) {
  return Model.obtenerDataById(data);
}
function obtenerAvancesMensuales(data) {
  return Model.obtenerAvancesMensuales(data);
}
function maxIdPim(data) {
  return Model.maxIdPim(data);
}
function obtenerPim(data) {
  return Model.obtenerPim(data);
}
function obtenerPia(data) {
  return Model.obtenerPia(data);
}
function obtenerProgramadoAcumulado(data) {
  return Model.obtenerProgramadoAcumulado(data);
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
  obtenerTodosEspecificasVariacionesPim,
  obtenerTodosEspecificasVariacionesPimMonto,
  guardarVariacionesPim,
  actualizarVariacionesPim,
  eliminarVariacionesPim,
  actualizarVariacionesPimMonto,
  asignarCosto,
  getDataParaActualizarAvanceMensual,
  getMontoParaActualizarAvanceMensual,
  predecirFuenteFinanciamiento,
  obtenerDataById,
  obtenerAvancesMensuales,
  maxIdPim,
  obtenerPim,
  obtenerPia,
  obtenerProgramadoAcumulado,
};
