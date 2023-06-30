const sequelize = require("../../../config/sequelizeConfig");
// const Model = require("./model");
const {
  asignacion,
  cargosObreros,
  historialPersonalNoTecnico: Model,
} = require("../models");
const getAllData = async (req, res) => {
  try {
    const id_personal = req.query.id_personal;
    const id_ficha = req.query.id_ficha;

    const models = await sequelize.query(
      "CALL getHistorialPersonalNoTecnico(:id_ficha, :id_personal)",
      {
        replacements: { id_ficha, id_personal },
        type: sequelize.QueryTypes.RAW, /// Usar  RAW para formatear mejor el JSON, tratar de no usar SELECT
      }
    );

    res.json(models);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Model.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const createData = async (req, res) => {
  try {
    const data = await Model.create(req.body);
    const formattedData = {
      ...data.toJSON(),
      mes_ano: data.mes_ano.toISOString().substr(0, 10),
    };
    const response = await asignacion.findByPk(data.id_asignacion);

    res
      .status(201)
      .json({ ...formattedData, id_cargo: response.id_cargos_obreros });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateData = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Model.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Item not founda" });
    }

    await item.update(req.body);
    const formattedData = {
      ...item.toJSON(),
      mes_ano: item.mes_ano.toISOString().substr(0, 10),
    };
    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server errors" });
  }
};

const deleteData = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Model.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    await item.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllData,
  getItemById,
  createData,
  updateData,
  deleteData,
};
