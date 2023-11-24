// Import Modules from installed libraries
const asyncHandler = require("express-async-handler");

// Import Local Modules
const Like = require("../models/interactions/likesModel");
const Comment = require("../models/interactions/commentsModel");
const Save = require("../models/interactions/saveModel");
const FieldsValidator = require("../helpers/FieldsValidator");
const ResponseBuilder = require("../helpers/ResponseBuilder");
const { exceptionLogger } = require("../logs");

const LikeController = asyncHandler(async (req, res) => {
    const { user_id, recipe_id } = req.body;
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the desctructured fields are in the request body
    if (
        !fields.areKeysInRequest({
            user_id,
            recipe_id,
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

    try {
        let interactionData = {
            user_id,
            recipe_id,
        };
        let isUserAlreadyLiked = await Like.findOne({ user_id, recipe_id });

        // If the user already liked the recipe, delete the like
        if (isUserAlreadyLiked) {
            await Like.deleteOne({ user_id, recipe_id });

            response.send(201, "success", "User has unliked the recipe");
            return;
        } else {
            let savedInteraction = await Like.create(interactionData);

            if (!savedInteraction) {
                response.send(400, "fail", "Could not save interaction");
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
        exceptionLogger.error(error);

        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

const CommentController = asyncHandler(async (req, res) => {
    const { user_id, username, recipe_id, user_comment } = req.body;
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the desctructured fields are in the request body
    if (
        !fields.areKeysInRequest({
            user_id,
            username,
            recipe_id,
            user_comment,
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

    try {
        let interactionData = {
            username,
            user_id,
            recipe_id,
            user_comment,
        };

        let savedInteraction = await Comment.create(interactionData);

        if (!savedInteraction) {
            response.send(400, "fail", "Could not save interaction");
            return;
        }

        response.send(
            201,
            "success",
            `New comment has been saved`,
            savedInteraction
        );
        return;
    } catch (error) {
        // Log the error
        exceptionLogger.error(error);

        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

const SaveController = asyncHandler(async (req, res) => {
    const { user_id, recipe_id } = req.body;
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the desctructured fields are in the request body
    if (
        !fields.areKeysInRequest({
            user_id,
            recipe_id,
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

    try {
        let interactionData = {
            user_id,
            recipe_id,
        };
        let isUserAlreadyLiked = await Save.findOne({ user_id, recipe_id });

        // If the user already save the recipe, delete the save
        if (isUserAlreadyLiked) {
            await Save.deleteOne({ user_id, recipe_id });

            response.send(201, "success", "User has unsave the recipe");
            return;
        } else {
            let savedInteraction = await Save.create(interactionData);

            if (!savedInteraction) {
                response.send(400, "fail", "Could not save interaction");
                return;
            }

            response.send(
                201,
                "success",
                `New save has been saved`,
                savedInteraction
            );
            return;
        }
    } catch (error) {
        // Log the error
        exceptionLogger.error(error);

        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

module.exports = { LikeController, CommentController, SaveController };
