const errorHandler = require("../api/libs/errorHandler");

const configureErrorHandling = (app) => {
  app.use(errorHandler.procesarErroresDeDB);
  app.use(errorHandler.procesarErroresDeTamanioDeBody);

  if (process.env.NODE_ENV === "prod") {
    app.use(errorHandler.erroresEnProducción);
  } else {
    app.use(errorHandler.erroresEnDesarrollo);
  }
};

module.exports = configureErrorHandling;
