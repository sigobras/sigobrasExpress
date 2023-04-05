const express = require("express");
const path = require("path");
require("dotenv").config();

const pool = require("./config/db.config");

const app = express();

// Database connection
global.pool = pool;
pool.query(`USE ${process.env.DATABASE}`);

// Public folder
global.publicFolder = path.join(__dirname, "public");

const configurePassport = require("./config/passport.config");
const configureBodyParser = require("./config/bodyParser.config");
const configureMorgan = require("./config/morgan.config");
const configureSecurity = require("./config/security.config");
const configureRoutes = require("./config/routes.config");
const configureStaticFiles = require("./config/staticFiles.config");
const configureErrorHandling = require("./config/errorHandling.config");
const startServer = () => {
  const PORT = process.env.PORT || 9000;
  const server = app.listen(PORT, () => {
    console.log("running in port", PORT);
  });

  // Sockets
  require("./services/socket")(server);

  return {
    app,
    server,
  };
};

// Add a route handler for the root endpoint "/"
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const main = () => {
  configurePassport(app);
  configureBodyParser(app);
  configureMorgan(app);
  configureSecurity(app);
  configureRoutes(app);
  configureStaticFiles(app);
  configureErrorHandling(app);

  return startServer();
};

module.exports = main();
