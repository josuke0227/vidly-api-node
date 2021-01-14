const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
// listen retunr db object
const server = app.listen(
  port,
  winston
    .createLogger({
      transports: [new winston.transports.Console()],
    })
    .log({
      level: "info",
      message: `Connected to ${port}...`,
    })
);

module.exports = server;
