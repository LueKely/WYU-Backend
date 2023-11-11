/**
 * Logger Utility Module
 * @module logger
 * @description Provides a Winston logger configuration for logging errors, warnings, info, and debug messages.
 */

const Winston = require("winston");
const path = require("path");

/**
 * Log levels configuration.
 * @constant
 * @type {Object}
 */
const logLevels = {
    error: "error",
    warn: "warn",
    exception: "exception",
    info: "info",
    debug: "debug",
};

/**
 * Log format configuration for Winston logger.
 * @constant
 * @type {Object}
 */
const logFormat = Winston.format.combine(
    Winston.format.timestamp({
        format: "YYYY-MM-DD | h:mm A",
    }),
    Winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}] => ${message}`;
    })
);

/**
 * Winston logger instance configuration.
 * @constant
 * @type {Object}
 */
const exceptionLogger = Winston.createLogger({
    level: "exception",
    levels: logLevels,
    format: logFormat,
    transports: [
        /**
         * File transport configuration for logging exceptions.
         * @type {Object}
         */
        new Winston.transports.File({
            filename: path.join(__dirname, "/logs/exception_logs.log"),
        }),
    ],
});

const accessLogger = Winston.createLogger({
    level: "info",
    levels: logLevels,
    format: logFormat,
    transports: [
        /**
         * File transport configuration for logging access.
         * @type {Object}
         */
        new Winston.transports.File({
            filename: path.join(__dirname, "/logs/access_logs.log"),
        }),
    ],
});

/**
 * Exporting the configured Winston logger.
 * @type {Object}
 */
module.exports = { exceptionLogger, accessLogger };
