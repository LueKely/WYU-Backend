// Import Modules from installed libraries
const asyncHandler = require("express-async-handler");

// Import Local Modules
const { User, Like, Save, Comment } = require("../models/index");
const FieldsValidator = require("../helpers/FieldsValidator");
const ResponseBuilder = require("../helpers/ResponseBuilder");
const { exceptionLogger } = require("../logs");

/**
 * Controller function to handle the like interaction for a recipe.
 *
 * @async
 * @function LikeController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const LikeController = asyncHandler(async (req, res) => {
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
        const { user_id, recipe_id } = req.body;

        const interactionData = {
            user_id,
            recipe_id,
        };

        const isUserAlreadyLiked = await Like.findOne({ user_id, recipe_id });

        // If the user already liked the recipe, delete the like
        if (isUserAlreadyLiked) {
            await Like.deleteOne({ user_id, recipe_id });

            response.send(201, "success", "User unliked the recipe");
            return;
        } else {
            const savedInteraction = await Like.create(interactionData);

            if (!savedInteraction) {
                response.send(400, "fail", "Could not save like interaction");
                return;
            }

            response.send(
                201,
                "success",
                `New like has been saved`,
                savedInteraction
            );
            return;
        }
    } catch (error) {
        // Log the error
        console.error(error);
        exceptionLogger.error(error);
        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

/**
 * Controller function to handle the save interaction for a recipe.
 *
 * @async
 * @function SaveController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const SaveController = asyncHandler(async (req, res) => {
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
        const { user_id, recipe_id } = req.body;

        const interactionData = {
            user_id,
            recipe_id,
        };
        const isUserAlreadyLiked = await Save.findOne({ user_id, recipe_id });

        // If the user already save the recipe, delete the save
        if (isUserAlreadyLiked) {
            await Save.deleteOne({ user_id, recipe_id });

            response.send(201, "success", "User unsave the recipe");
            return;
        } else {
            const savedInteraction = await Save.create(interactionData);

            if (!savedInteraction) {
                response.send(400, "fail", "Could not add save interaction");
                return;
            }

            response.send(
                201,
                "success",
                `New save has been added`,
                savedInteraction
            );
            return;
        }
    } catch (error) {
        // Log the error
        console.error(error);
        exceptionLogger.error(error);
        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

/**
 * Controller function to handle the comment interaction for a recipe.
 *
 * @async
 * @function CommentController
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const CommentController = asyncHandler(async (req, res) => {
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
        const interactionData = { ...req.body };

        const user = await User.findById(interactionData.user_id);
        let savedInteraction = await Comment.create(interactionData);

        if (!savedInteraction) {
            response.send(400, "fail", "Could not add comment interaction");
            return;
        }

        savedInteraction = {
            ...savedInteraction._doc,
            user_profile_image: user.user_profile_image,
        };

        console.log(savedInteraction);

        response.send(
            201,
            "success",
            `New comment has been added`,
            savedInteraction
        );
    } catch (error) {
        // Log the error
        console.error(error);
        exceptionLogger.error(error);

        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

module.exports = { LikeController, CommentController, SaveController };
