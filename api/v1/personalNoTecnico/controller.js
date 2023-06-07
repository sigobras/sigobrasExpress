const { personalNoTecnico: Model, asignacion } = require("../models");

const getAllData = async (req, res) => {
  try {
    console.log(req.query);
    const obra = req.query.obra;
    console.log({ obra });
    const items = await Model.findAll({
      include: [
        {
          model: asignacion,
          as: "asignacion",
          where: {
            id_ficha: obra,
          },
          required: true,
        },
      ],
      raw: true,
    });
    res.json(items);
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
    const dni = req.body.dni;
    const existingItem = await Model.findOne({ where: { dni } });
    let id_personal_no_tecnico = existingItem?.id;
    let dataPersonal = existingItem;
    if (!existingItem) {
      dataPersonal = await Model.create(req.body);
      id_personal_no_tecnico = dataPersonal.id;
    }
    const dataAsignacion = await asignacion.create({
      id_personal_no_tecnico,
      id_ficha: req.body.id_ficha,
      id_cargos_obreros: req.body.id_cargo,
    });
    res.status(201).json({
      ...dataPersonal.get({ plain: true }),
      ...dataAsignacion.get({ plain: true }),
    });
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
