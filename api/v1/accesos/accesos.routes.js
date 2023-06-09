const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ms = require("ms");

const log = require("../../../utils/logger");
const validarUsuario = require("./accesos.validate").validarUsuario;
const validarPedidoDeLogin = require("./accesos.validate").validarPedidoDeLogin;
const config = require("../../../config");
const accesoController = require("./accesos.controller");
const ControllerDesignaciones = require("../designaciones/designaciones.controller");

const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const {
  DatosDeUsuarioYaEnUso,
  CredencialesIncorrectas,
} = require("./accesos.error");

const accesosRouter = express.Router();

function transformarBodyALowercase(req, res, next) {
  req.body.usuario && (req.body.usuario = req.body.usuario.toLowerCase());
  next();
}
accesosRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await accesoController.obtenerTodos();
    res.json(response);
  })
);
accesosRouter.post(
  "/",
  [validarUsuario, transformarBodyALowercase],
  procesarErrores(async (req, res) => {
    let nuevoUsuario = req.body;
    var usuarioExiste = await accesoController.existe(nuevoUsuario);
    if (usuarioExiste) {
      log.warn(
        `username [${nuevoUsuario.username}] ya existen en la base de datos`
      );
      throw new DatosDeUsuarioYaEnUso();
    } else {
      var password = await bcrypt.hash(nuevoUsuario.password, 10);
      await accesoController.crear({
        ...nuevoUsuario,
        password,
      });
      res.status(201).send("Usuario creado exitósamente.");
    }
  })
);
accesosRouter.post(
  "/login",
  [validarPedidoDeLogin, transformarBodyALowercase],
  procesarErrores(async (req, res) => {
    const usuarioNoAutenticado = req.body;

    const usuarioRegistrado = await accesoController.obtenerUno(
      usuarioNoAutenticado
    );
    if (!usuarioRegistrado) {
      log.info(
        `El usuario [${usuarioNoAutenticado.usuario}] no existe. No se puede autenticar.`
      );
      throw new CredencialesIncorrectas();
    }

    const passwordCorrecto = await bcrypt.compare(
      usuarioNoAutenticado.password,
      usuarioRegistrado.password
    );
    if (passwordCorrecto) {
      const token = jwt.sign(
        { id: usuarioRegistrado.id_acceso },
        config.jwt.secreto,
        {
          expiresIn: config.jwt.tiempoDeExpiración,
        }
      );
      const tokenExpiracion = new Date(
        Date.now() + ms(config.jwt.tiempoDeExpiración)
      );
      log.info(
        `El usuario ${usuarioNoAutenticado.usuario} ha completado la autenticación exitosamente.`
      );
      res.status(200).json({
        status: "success",
        message: "Inicio de sesión exitoso",
        data: {
          token: token,
          user_id: usuarioRegistrado.id_acceso,
          token_expiration: tokenExpiracion.toISOString(),
          user_data: {
            estado: usuarioRegistrado.estado,
            fecha_inicial: usuarioRegistrado.fecha_inicial,
            ultima_modificacion: usuarioRegistrado.ultima_modificacion,
            nombre: usuarioRegistrado.nombre,
            apellido_paterno: usuarioRegistrado.apellido_paterno,
            apellido_materno: usuarioRegistrado.apellido_materno,
            imagen: usuarioRegistrado.imagen,
          },
        },
      });
    } else {
      log.info(
        `El usuario ${usuarioNoAutenticado.usuario} no ha completado la autenticación. La contraseña es incorrecta.`
      );
      throw new CredencialesIncorrectas();
    }
  })
);

accesosRouter.put(
  "/",
  [validarUsuario, transformarBodyALowercase],
  procesarErrores(async (req, res) => {
    let nuevoUsuario = req.body;
    var usuarioExiste = await accesoController.existe(nuevoUsuario);
    if (usuarioExiste) {
      log.warn(
        `username [${nuevoUsuario.username}] ya existen en la base de datos`
      );
      throw new DatosDeUsuarioYaEnUso();
    } else {
      var hash = await bcrypt.hash(nuevoUsuario.password, 10);
      await accesoController.crear({
        ...nuevoUsuario,
        hash,
      });
      res.status(201).send("Usuario creado exitósamente.");
    }
  })
);
accesosRouter.post(
  "/asignarObra",
  procesarErrores(async (req, res) => {
    var fecha_inicio = req.body.fecha_inicio;
    delete req.body.fecha_inicio;
    //se revisa si hay asignacion ya registrada
    var dataAsignacion = await accesoController.getDataAsignacion(req.body);
    var id = 0;
    if (dataAsignacion?.id) {
      id = dataAsignacion.id;
    } else {
      var response = await accesoController.asignarObra(req.body);
      id = response.insertId;
    }
    if (id) {
      var objectDesignacion = {
        fecha_inicio,
        fichas_has_accesos_id: id,
      };
      var response2 = await ControllerDesignaciones.guardarDesignacion(
        objectDesignacion
      );
      console.log("response2", response2);
    }
    res.json({ message: "exito" });
  })
);
module.exports = accesosRouter;
