/**
 * Authentication Controller Module
 * @module authController
 * @description Provides controller functions for user registration, login, and logout.
 */

// Import Modules from installed libraries
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// Import Local Modules
const User = require("../models/userModel");
const FieldsValidator = require("../helpers/FieldsValidator");
const ResponseBuilder = require("../helpers/ResponseBuilder");
const TokenManager = require("../helpers/TokenManager");
const { exceptionLogger, accessLogger } = require("../logs");

/**
 * Handles the registration of a new user.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves once the registration process is complete.
 */
const RegisterUser = asyncHandler(async (req, res) => {
    const { username, email, password, first_name, last_name } = req.body;
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the desctructured fields are in the request body
    if (
        !fields.areKeysInRequest({
            username,
            email,
            password,
            first_name,
            last_name,
        })
    ) {
        response.send(
            400,
            "fail",
            "Required fields are missing in the request"
        );
        return;
    }

    // Check if the fields in response are accepted
    if (!fields.areResponseKeysAccepted(req.body)) {
        response.send(400, "fail", "The provided field name is invalid");
        return;
    }

    // Check if any required fields are empty
    if (!fields.areResponseValuesEmpty(req.body)) {
        response.send(400, "fail", "Some fields have empty values");
        return;
    }

    // Check if harmful chars are in the fields
    if (fields.hasHarmfulChars(req.body)) {
        response.send(400, "fail", "Some fields has invalid characters");
        return;
    }

    // Check if the email is already registered
    const alreadyRegistered = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (alreadyRegistered) {
        response.send(
            400,
            "fail",
            "The provided username or email is already registered"
        );
        return;
    }

    try {
        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with hashed password
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            first_name,
            last_name,
        });

        if (!newUser) {
            response.send(400, "fail", "Failed to register user");
            return;
        }

        response.send(201, "success", "User successfully registered!");
        accessLogger.info(`New user register: ${username} ${email}`);
    } catch (error) {
        exceptionLogger.exception("Controllers: ", error);
        response.send(500, "error", "Internal Server Error");
    }
});

/**
 * Handles the login of a user.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves once the login process is complete.
 */
const LoginUser = asyncHandler(async (req, res) => {
    const { login_identifier, password } = req.body;
    const response = new ResponseBuilder(req, res);
    const token = new TokenManager();
    const fields = new FieldsValidator(req);

    // Check if login_identifier and password fields exist in req.body
    if (!fields.areKeysInRequest({ login_identifier, password })) {
        response.send(
            400,
            "fail",
            "Required fields are missing in the request"
        );
        return;
    }

    // Check if the fields in response are accepted
    if (!fields.areResponseKeysAccepted(req.body)) {
        response.send(400, "fail", "The provided field name is invalid");
        return;
    }

    // Check if any required fields are empty
    if (!fields.areResponseValuesEmpty(req.body)) {
        response.send(400, "fail", "Some fields value are missing");
        return;
    }

    try {
        const user = await User.findOne({
            $or: [{ username: login_identifier }, { email: login_identifier }],
        });

        if (user) {
            // Check if the password matched
            const isPasswordMatched = await bcrypt.compare(
                password,
                user.password
            );

            if (isPasswordMatched) {
                const userData = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                };

                const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60;
                const accessToken = token.generate(userData, expirationDate);

                if (accessToken) {
                    response.send(200, "success", "Login Success!", {
                        userData,
                        token: accessToken,
                    });
                    accessLogger.info(`User logged in: ${login_identifier}`);
                    return;
                }

                // If token generation is not success
                response.send(500, "fail", "Failed to generate token");
                return;
            }

            // If password is not match
            response.send(401, "fail", "Invalid Credentials");
            return;
        } else {
            // If the user is not found
            response.send(401, "fail", "Invalid Credentials");
        }
    } catch (error) {
        exceptionLogger.exception("Controllers: ", error);
        response.send(500, "error", "Internal Server Error");
    }
});

/**
 * Handles the logout of a user.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves once the logout process is complete.
 */
const LogoutUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Logout User" });
});

module.exports = { RegisterUser, LoginUser, LogoutUser };
