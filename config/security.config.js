const helmet = require("helmet");
const cors = require("cors");

const configureSecurity = (app) => {
  app.use(cors());
  app.use(helmet());
};

module.exports = configureSecurity;
