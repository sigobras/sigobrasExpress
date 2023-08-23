const Model = require("./model");
const sequelize = require("../../../config/sequelizeConfig");

const deletePartida = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Model.findByPk(id);
    if (!result) {
      return res.status(404).json({ message: "Departure was not deleted" });
    }
    await result.destroy();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  deletePartida,
};
