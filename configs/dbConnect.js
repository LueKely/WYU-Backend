/**
 * Database Connection Module
 * @module database
 * @description Provides functions to establish and manage database connections using Mongoose.
 */

const mongoose = require("mongoose");
const { exceptionLogger } = require("../logs");

/**
 * Establishes a connection to the MongoDB database.
 * @function
 * @async
 * @returns {Promise<Object>} A promise that resolves to an object indicating the status of the database connection.
 * @throws {Error} If there is an error connecting to the database.
 */
const ConnectDB = async () => {
    try {
        // Cnnect to the database
        const connect = await mongoose.connect(
            process.env.DB_CONNECTION_STRING
        );

        // Build a Response Object
        const response = {
            status: "success",
            message: `Successfully connected to the database`,
        };

        return response;
    } catch (error) {
        console.log(`Error connecting to the database`);
        // Log the exception
        exceptionLogger.exception("(Database): ", error);
        process.exit(1);
    }
};

/**
 * Exports the ConnectDB function for establishing a database connection.
 * @type {Function}
 */
module.exports = ConnectDB;
