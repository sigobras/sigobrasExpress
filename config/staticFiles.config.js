const express = require("express");

const configureStaticFiles = (app) => {
  app.use("/static", express.static("public"));
};

module.exports = configureStaticFiles;
