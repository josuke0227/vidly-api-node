const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(
    new winston.transports.Console({
      format: winston.format.prettyPrint(),
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
      handleExceptions: true,
    }),
    // new winston.transports.MongoDB({
    //   db: "mongodb://localhost/vidly-second",
    //   level: "info",
    // }),
    new winston.transports.File({ filename: "logfile.log" })
  );
};
