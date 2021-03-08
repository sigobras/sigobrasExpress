const accesos = require("./accesos/accesos.routes");
const obras = require("./obras/obras.routes");
const unidadEjecutora = require("./unidadEjecutora/unidadEjecutora.routes");
const sectores = require("./sectores/sectores.routes");
const obrasComunicados = require("./obrasComunicados/obrasComunicados.routes");
const componentes = require("./componentes/componentes.routes");
const obrasEstados = require("./obrasEstados/obrasEstados.routes");
const avance = require("./avance/avance.routes");
const obrasAmpliacionesPresupuesto = require("./obrasAmpliacionesPresupuesto/obrasAmpliacionesPresupuesto.routes");
const obrasCostosIndirectos = require("./obrasCostosIndirectos/obrasCostosIndirectos.routes");
const obrasLabels = require("./obrasLabels/obrasLabels.routes");
const cargos = require("./cargos/cargos.routes");
const usuarios = require("./usuarios/usuarios.routes");
const partidas = require("./partidas/partidas.routes");
const obrasPlazos = require("./obrasPlazos/obrasPlazos.routes");
const datosAnuales = require("./datosAnuales/datosAnuales.routes");
const analitico = require("./analitico/analitico.routes.js");
const fuentesFinancieamiento = require("./fuentesFinancieamiento/fuentesFinancieamiento.routes.js");
const designaciones = require("./designaciones/designaciones.routes.js");
const presupuestosAprobados = require("./presupuestosAprobados/presupuestosAprobados.routes.js");
const analiticoCostos = require("./analiticoCostos/analiticoCostos.routes.js");
const clasificadorPresupuestario = require("./clasificadorPresupuestario/clasificadorPresupuestario.routes.js");
const problemasObra = require("./problemasObra/problemasObra.routes.js");
const infobras = require("./infobras/infobras.routes.js");
const informesUbicaciones = require("./informesUbicaciones/informesUbicaciones.routes.js");
const reporteGeneral = require("./reporteGeneral/reporteGeneral.routes.js");
const interfazPermisos = require("./interfazPermisos/interfazPermisos.routes.js");

const express = require("express");
const router = express.Router();

router.use("/accesos", accesos);
router.use("/obras", obras);
router.use("/unidadEjecutora", unidadEjecutora);
router.use("/sectores", sectores);
router.use("/obrasComunicados", obrasComunicados);
router.use("/componentes", componentes);
router.use("/obrasEstados", obrasEstados);
router.use("/avance", avance);
router.use("/obrasAmpliacionesPresupuesto", obrasAmpliacionesPresupuesto);
router.use("/obrasCostosIndirectos", obrasCostosIndirectos);
router.use("/obrasLabels", obrasLabels);
router.use("/cargos", cargos);
router.use("/usuarios", usuarios);
router.use("/partidas", partidas);
router.use("/obrasPlazos", obrasPlazos);
router.use("/datosAnuales", datosAnuales);
router.use("/analitico", analitico);
router.use("/fuentesFinancieamiento", fuentesFinancieamiento);
router.use("/designaciones", designaciones);
router.use("/presupuestosAprobados", presupuestosAprobados);
router.use("/analiticoCostos", analiticoCostos);
router.use("/clasificadorPresupuestario", clasificadorPresupuestario);
router.use("/problemasObra", problemasObra);
router.use("/infobras", infobras);
router.use("/informesUbicaciones", informesUbicaciones);
router.use("/reporteGeneral", reporteGeneral);
router.use("/interfazPermisos", interfazPermisos);

module.exports = router;
