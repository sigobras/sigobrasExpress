const sequelize = require("../../../config/sequelizeConfig");
const {
  personalNoTecnico: Model,
  asignacion,
  cargosObreros,
} = require("../models");

const getAllData = async (req, res) => {
  try {
    const id_ficha = req.query.id_ficha;
    const items = await sequelize.query(
      "CALL ObtenerAsignacionesPorIdFicha(:id_ficha)",
      {
        replacements: { id_ficha: id_ficha },
        type: sequelize.QueryTypes.SELECT,
      }
    );
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
    const cargo = await cargosObreros.findOne({
      where: { id: req.body.id_cargo },
    });
    res.status(201).json({
      ...dataPersonal.get({ plain: true }),
      ...dataAsignacion.get({ plain: true }),
      cargo: cargo.get({ plain: true }).nombre,
      id_asignacion: dataAsignacion.get({ plain: true }).id
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
