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
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the desctructured fields are in the request body
    if (!fields.areKeysInRequest(req.body, "body")) {
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

    try {
        const {
            username,
            email,
            password,
            first_name,
            last_name,
            user_bio,
            fb_username,
            ig_username,
            twt_username,
            user_profile_image,
            user_bg_image,
            user_level,
        } = req.body;

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

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with hashed password
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            first_name,
            last_name,
            user_bio,
            fb_username,
            ig_username,
            twt_username,
            user_profile_image,
            user_bg_image,
            user_level,
        });

        if (!newUser) {
            response.send(400, "fail", "Failed to register user");
            return;
        }

        response.send(201, "success", "User successfully registered!");
        accessLogger.info(`New user register: ${username} ${email}`);
    } catch (error) {
        console.error(error);
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
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);
    const token = new TokenManager();

    // Check if login_identifier and password fields exist in req.body
    if (!fields.areKeysInRequest(req.body, "body")) {
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
        const { login_identifier, password } = req.body;

        const user = await User.findOne({
            $or: [{ username: login_identifier }, { email: login_identifier }],
        });

        // If the user is not found
        if (!user) {
            response.send(401, "fail", "User not found");
            return;
        }

        // Check if the password matched
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            response.send(401, "fail", "Password not match");
            return;
        }

        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            user_level: user.user_level,
        };

        const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60;
        const accessToken = token.generate(userData, expirationDate);

        // If token generation is not success
        if (!accessToken) {
            response.send(500, "fail", "Failed to generate token");
            return;
        }

        response.send(200, "success", "Login Success!", {
            userData,
            token: accessToken,
        });
        accessLogger.info(`User logged in: ${login_identifier}`);
        return;
    } catch (error) {
        exceptionLogger.exception("Controllers: ", error);
        response.send(500, "error", "Internal Server Error");
    }
});

module.exports = { RegisterUser, LoginUser };
