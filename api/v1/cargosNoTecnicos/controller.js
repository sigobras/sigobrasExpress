const { cargosObreros: Model } = require("../models");

const getAllData = async (req, res) => {
  try {
    const models = await Model.findAll();
    res.json(models);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllData,
};
