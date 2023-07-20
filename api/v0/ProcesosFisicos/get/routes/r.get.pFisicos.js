const User = require("../models/m.get.pFisicos");
module.exports = (app) => {
  app.post("/getComponentes", async (req, res) => {
    try {
      var componentes = await User.getComponentes(req.body.id_ficha);
      res.json(componentes);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getTotalConteoPartidas", async (req, res) => {
    try {
      var partidas = await User.getTotalConteoPartidas(req.body);
      res.json(partidas);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getPartidas", async (req, res) => {
    try {
      if (
        req.body.id_componente == null ||
        req.body.id_componente == "null" ||
        req.body.id_componente == ""
      ) {
        res.json("null");
      } else {
        var partidas = await User.getPartidas(req.body.id_componente, null);
        res.json(partidas);
      }
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });

  app.post("/getPartidas2", async (req, res) => {
    try {
      const { body } = req;
      const partidas = await User.getPartidas2(body);

      const avancePromises = await Promise.all(
        partidas.map(async (partida) => {
          if (partida.tipo === "partida") {
            const avancePartida = await User.getAvancePartida(
              partida.id_partida
            );
            return { ...partida, ...avancePartida };
          }
          return partida;
        })
      );
      const partidasConAvance = await Promise.all(avancePromises);
      res.json(partidasConAvance);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  app.post("/getPartidaById", async (req, res) => {
    try {
      var data = await User.getPartidaById(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getAvancePartida", async (req, res) => {
    try {
      var partidas = await User.getAvancePartida(req.body.id_partida);
      res.json(partidas);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getActividades", async (req, res) => {
    try {
      if (
        req.body.id_partida == null ||
        req.body.id_partida == "null" ||
        req.body.id_partida == ""
      ) {
        res.json("null");
      } else {
        var data = await User.getActividades(req.body.id_partida);
        mayorMetrado = await User.getPartidasMayorMetradoAvance(
          req.body.id_partida
        );
        mayorMetrado = mayorMetrado || {};
        res.json({
          mayor_metrado: {
            mm_avance_metrado: mayorMetrado.avance_metrado || 0,
            mm_avance_costo: mayorMetrado.avance_costo || 0,
            mm_metrados_saldo: mayorMetrado.metrados_saldo || 0,
            mm_metrados_costo_saldo: mayorMetrado.metrados_costo_saldo || 0,
            mm_porcentaje: mayorMetrado.porcentaje || 0,
          },
          actividades: data,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getActividades2", async (req, res) => {
    try {
      const { id_partida } = req.body;
      const actividades = await User.getActividades2(id_partida);

      const actividadesConAvance = await Promise.all(
        actividades.map(async (actividad) => {
          if (actividad.tipo === "subtitulo") {
            const avanceActividad = await User.getAvanceActividad(
              actividad.id_actividad
            );
            return { ...actividad, ...avanceActividad };
          }
          return actividad;
        })
      );

      res.json(actividadesConAvance);
    } catch (error) {
      console.error(error);
      res.status(204).json(error);
    }
  });

  app.post("/getAvanceActividad", async (req, res) => {
    try {
      var req = await User.getAvanceActividad(req.body.id_actividad);
      res.json(req);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });

  app.post("/getComponentesPNuevas", async (req, res) => {
    try {
      if (req.body.id_ficha == null) {
        res.json("null");
      } else {
        var componentes = await User.getComponentesPNuevas(req.body.id_ficha);
        if (componentes == "vacio") {
          res.json("vacio");
        } else {
          var partidas = await User.getPartidasPNuevas(
            componentes[0].id_componente
          );
          componentes[0].partidas = partidas;
          res.json(componentes);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getPartidasPNuevas", async (req, res) => {
    try {
      var data = await User.getPartidasPNuevas(req.body.id_componente);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getActividadesPNuevas", async (req, res) => {
    try {
      if (
        req.body.id_partida == null ||
        req.body.id_partida == "null" ||
        req.body.id_partida == ""
      ) {
        res.json("null");
      } else {
        var data = await User.getActividades(req.body.id_partida);
        mayorMetrado = await User.getPartidasMayorMetradoAvance(
          req.body.id_partida
        );
        mayorMetrado = mayorMetrado || {};
        res.json({
          mayor_metrado: {
            mm_avance_metrado: mayorMetrado.avance_metrado || 0,
            mm_avance_costo: mayorMetrado.avance_costo || 0,
            mm_metrados_saldo: mayorMetrado.metrados_saldo || 0,
            mm_metrados_costo_saldo: mayorMetrado.metrados_costo_saldo || 0,
            mm_porcentaje: mayorMetrado.porcentaje || 0,
          },
          actividades: data,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getActividadesDuracion", async (req, res) => {
    try {
      var data = await User.getActividadesDuracion(req.body.id_ficha);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.get("/getPrioridades", async (req, res) => {
    try {
      var data = await User.getPrioridades();
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.get("/getIconoscategorias", async (req, res) => {
    try {
      var data = await User.getIconoscategorias();
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getPartidasObra", async (req, res) => {
    try {
      var data = await User.getPartidas(null, null, req.body.id_ficha, false);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getPartidaComentarios", async (req, res) => {
    try {
      var data = await User.getPartidaComentarios(req.body.id_partida);
      var req_comentariosNoVistos = await User.getComentariosNoVistos(
        req.body.id_acceso,
        req.body.id_partida
      );
      var idComentariosNoVistos = [];
      console.log(req_comentariosNoVistos);
      req_comentariosNoVistos.forEach((element) => {
        idComentariosNoVistos.push([req.body.id_acceso, element.id]);
      });
      if (idComentariosNoVistos.length > 0) {
        var req_comentariosVistos = await User.postComentariosVistos(
          idComentariosNoVistos
        );
        console.log("re2", req_comentariosVistos);
      }
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/postPartidaComentarios", async (req, res) => {
    try {
      var data = await User.postPartidaComentario(
        req.body.comentario,
        req.body.id_partida,
        req.body.id_acceso
      );
      res.json({ message: "comentario guardado exitosamente" });
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getComponenteComentariosNoVistos", async (req, res) => {
    try {
      var data = await User.getComponenteComentariosNoVistos(
        req.body.id_componente,
        req.body.id_acceso
      );
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/postComentariosVistos", async (req, res) => {
    try {
      var req_comentariosNoVistos = await User.getComentariosNoVistos(
        req.body.id_acceso,
        req.body.id_partida
      );
      var idComentariosNoVistos = [];
      req_comentariosNoVistos.forEach((element) => {
        idComentariosNoVistos.push([req.body.id_acceso, element.id]);
      });
      if (idComentariosNoVistos.length > 0) {
        var req_comentariosVistos = await User.postComentariosVistos(
          idComentariosNoVistos
        );
        console.log("re", req_comentariosVistos);
      }
      res.json({ message: "mensajes visteados exitosamente" });
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getComponentesComentarios", async (req, res) => {
    try {
      var data = await User.getComponentesComentarios(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getPartidaComentariosNoVistos", async (req, res) => {
    try {
      var data = await User.getPartidaComentariosNoVistos(
        req.body.id_acceso,
        req.body.id_partida
      );
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getPartidaComentariosTotales", async (req, res) => {
    try {
      var data = await User.getPartidaComentariosTotales(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
};
