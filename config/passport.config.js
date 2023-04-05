const passport = require("passport");
const authJWT = require("../api/libs/auth");

const configurePassport = (app) => {
  passport.use(authJWT);
  app.use(passport.initialize());
};

module.exports = configurePassport;
