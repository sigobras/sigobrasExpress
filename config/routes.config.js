const passport = require("passport");
const authJWT = require("../api/libs/auth");
const v1 = require("../api/v1/index.route");

const configureRoutes = (app) => {
  // Passport configuration
  passport.use(authJWT);
  app.use(passport.initialize());

  // Old routes
  require("../api/v0/index.route")(app);

  // v1 API
  app.use("/v1", v1);
};

module.exports = configureRoutes;
