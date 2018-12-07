"use strict";

const winston = require("winston");

const myCustomLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
  }
  ,
  colors: {
    info: "green",
    warn: "yellow",
    verbose: "blue",
    error: "red",
    critical: "red"
  }
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      timestamp: true
    }),
    new winston.transports.File({
      filename: __dirname + "/debug.log"
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      timestamp: true
    }),
    new winston.transports.File({
      filename: __dirname + "/exceptions.log"
    })
  ],
  exitOnError: false,
  levels: myCustomLevels.levels
});

winston.addColors(myCustomLevels.colors);

module.exports = logger;
