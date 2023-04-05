const morgan = require("morgan");
const morganBody = require("morgan-body");
const logger = require("../utils/logger");

const configureMorgan = (app) => {
  app.use(morgan("dev"));
  morganBody(app);
  app.use(
    morgan("short", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );
};

module.exports = configureMorgan;
