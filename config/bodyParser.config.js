const bodyParser = require("body-parser");

const configureBodyParser = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: "50mb" }));
};

module.exports = configureBodyParser;
