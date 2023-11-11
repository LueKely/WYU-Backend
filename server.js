// Import libraries
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import local modules
const ConnectDB = require("./configs/dbConnect");
const { exceptionLogger } = require("./logs");

// Variable and function declarations
const app = express();
const PORT = process.env.PORT || 3001;

/**
 * This will ensure that the server starts only if the database connection is successful.
 */
const serverStart = async () => {
    try {
        const response = await ConnectDB();

        if (response.status === "success") {
            // All Middlewares will go here
            app.use(
                cors({
                    origin: "*",
                })
            );
            app.use(bodyParser.json());
            app.use("/api/user", require("./routes/userRoutes"));

            app.listen(PORT, () => {
                console.log(response.message);
                console.log(`Server running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error("Startup Error - ", error);
        exceptionLogger.error("(Server): ", error);
    }
};

serverStart();
