const Model = require("./model");

const getAllData = async (req, res) => {
  try {
    const models = await Model.findAll();
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
  getAllData,
  getItemById,
  createData,
  updateData,
  deleteData,
};
