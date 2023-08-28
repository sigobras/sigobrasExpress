const Model = require("./model");
const ModelPartida = require("../partidas/model");
const ModelComponente = require("../componentes/model");
const sequelize = require("../../../config/sequelizeConfig");

const getAllActivities = async (req, res) => {
  try {
    const result = await Model.findAll();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getActivityById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Model.findByPk(id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createActivity = async (req, res) => {
  let { actividades } = req.body;
  try{
    if (Array.isArray(actividades)) {
      const results = await Model.bulkCreate(actividades);
      res.status(200).json(results);
    } else {
      const { body } = req;
      const result = await Model.create(body);
      res.status(200).json(result);
    }
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Model.findByPk(id);
    if (!result) {
      return res.status(404).json({ message: "Activity not found" });
    }
    await result.update(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Model.findByPk(id);
    if (!result) {
      return res.status(404).json({ message: "Activity was not deleted" });
    }
    await result.destroy();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createNewByType = async (req, res) => {
  try {
    const { body } = req;
    const partidaData = await ModelPartida.findByPk(body.idPartida);
    const componenteData = await ModelComponente.findByPk(
      partidaData.componentes_id_componente
    );

    const existeComponente = await ModelComponente.findOne({
      where: {
        expediente_id: componenteData.expediente_id,
        tipo: body.tipo,
        numero: componenteData.numero,
      },
    });
    let newIdComponente = 0;
    if (existeComponente) {
      newIdComponente = existeComponente.id_componente;
    }

    if (!existeComponente) {
      const newComponente = await ModelComponente.create({
        expediente_id: componenteData.expediente_id,
        nombre: componenteData.nombre,
        presupuesto: componenteData.presupuesto,
        tipo: body.tipo,
        numero: componenteData.numero,
      });
      newIdComponente = newComponente.id_componente;
    }

    const existePartida = await ModelPartida.findOne({
      where: {
        componentes_id_componente: newIdComponente,
        item: partidaData.item,
      },
    });

    let newIdPartida = 0;
    if (existePartida) {
      newIdPartida = existePartida.id_partida;
    }

    if (!existePartida) {
      const newPartida = await ModelPartida.create({
        item: partidaData.item,
        descripcion: partidaData.descripcion,
        unidad_medida: partidaData.unidad_medida,
        metrado: partidaData.metrado,
        costo_unitario: partidaData.costo_unitario,
        equipo: partidaData.equipo,
        rendimiento: partidaData.rendimiento,
        tipo: partidaData.tipo,
        prioridad: partidaData.prioridad,
        componentes_id_componente: newIdComponente,
        iconosCategorias_id_iconoCategoria:
          partidaData.iconosCategorias_id_iconoCategoria,
        prioridades_id_prioridad: partidaData.prioridades_id_prioridad,
        iconoscategoriasrecursos_id_iconoscategoriasrecurso:
          partidaData.iconoscategoriasrecursos_id_iconoscategoriasrecurso,
        prioridadesRecursos_id_prioridadesRecurso:
          partidaData.prioridadesRecursos_id_prioridadesRecurso,
      });
      newIdPartida = newPartida.id_partida;
    }

    const actividadesConIdPartida = body.actividades.map((actividad) => {
      return {
        ...actividad,
        Partidas_id_partida: newIdPartida,
      };
    });

    const newActividad = await Model.bulkCreate(actividadesConIdPartida);

    res.status(200).json(newActividad);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  createNewByType,
};
