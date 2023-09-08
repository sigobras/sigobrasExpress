const Model = require("./model");
const ModelComponente = require("../componentes/model");
const { Sequelize, Op } = require('sequelize');
const sequelize = require("../../../config/sequelizeConfig");

const deletePartida = async (req, res) => {
  try {
    const { id } = req.params;
    const partida = await Model.findByPk(id);

    if (!partida) {
      return res.status(404).json({ message: "Partida no existe" });
    }

    const componenteId = partida.componentes_id_componente;
    const otrasPartidas = await Model.findAll({
      where: {
        componentes_id_componente: componenteId,
        id_partida: {
          [Op.ne]: id,
        },
      },
    });

    if (otrasPartidas.length === 0) {
      await ModelComponente.destroy({ where: { id_componente: componenteId } });
      res.status(200).json({ message: "Partida y Componente fueron eliminados" });
    } else {
      await partida.destroy();
      res.status(200).json({ message: "Partida fue eliminada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  deletePartida,
};