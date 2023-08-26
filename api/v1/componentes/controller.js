const Model = require("./model");
const sequelize = require('../../../config/sequelizeConfig'); // Reemplaza '../config/database' con la ubicación correcta de tu archivo de configuración de Sequelize

const getCountByType = async (req, res) => {
  try {
    const query = `CALL existemayormetradoypartidanueva(:expedienteId)`;
    const result = await sequelize.query(query, {
      replacements: { expedienteId:req.query.id_expediente },
      type: sequelize.QueryTypes.RAW
    });
  
    res.json (result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllDataByType = async (req, res) => {
  try {
    const result = await Model.findAll({
      where: {
        expediente_id: req.query.id_expediente,
        tipo: req.query.tipo
      }
    });
  
    res.json (result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
    res.status(201).json(data);
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
      return res.status(404).json({ message: "Item not found" });
    }
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
  getItemById,
  createData,
  updateData,
  deleteData,
  getCountByType,
  getAllDataByType,
};
