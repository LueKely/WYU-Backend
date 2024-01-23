// Import Modules from installed libraries
const asyncHandler = require("express-async-handler");

// Import Local Modules
const { User, Recipe, Comment, Like, Save } = require("../models/index");
const FieldsValidator = require("../helpers/FieldsValidator");
const ResponseBuilder = require("../helpers/ResponseBuilder");
const { exceptionLogger } = require("../logs");

const GetAllDashBoardStats = asyncHandler(async (req, res) => {
    const response = new ResponseBuilder(req, res);

    try {
        const listOfUsers = await User.find({}).select("-password");

        const listOfRecipes = await Recipe.find({})
            .sort({ updatedAt: -1 })
            .populate("user_id", "username");

        if (!listOfUsers || !listOfRecipes) {
            return response.send(404, "fail", "No users or recipes found");
        }

        const stats = {
            users: listOfUsers,
            recipes: listOfRecipes,
            totalUsers: listOfUsers.length,
            totalRecipes: listOfRecipes.length,
        };

        response.send(200, "success", "Dashboard stats", stats);
    } catch (error) {
        console.error(error);
        exceptionLogger.error(error);
        response.send(500, "fail", "Internal Server Error");
    }
});

const DeleteData = asyncHandler(async (req, res) => {
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the desctructured fields are in the request query
    if (!fields.areKeysInRequest(req.query, "query")) {
        response.send(
            400,
            "fail",
            "Required fields are missing in the request"
        );
        return;
    }

    // Check if the fields in response are accepted
    if (!fields.areResponseKeysAccepted(req.query)) {
        response.send(400, "fail", "The provided field name is invalid");
        return;
    }

    // Check if any required fields are empty
    if (!fields.areResponseValuesEmpty(req.query)) {
        response.send(400, "fail", "Some fields have empty values");
        return;
    }

    try {
        const { id, model } = req.query;

        if (!model || !id) {
            return response.send(400, "fail", "Invalid request");
        }

        if (model === "user") {
            const result = Promise.all([
                await User.findByIdAndDelete(id),
                await Recipe.deleteMany({ user_id: id }),
                await Comment.deleteMany({ user_id: id }),
                await Like.deleteMany({ user_id: id }),
                await Save.deleteMany({ user_id: id }),
            ]);

            if (!result) {
                return response.send(404, "fail", "User not found");
            }

            response.send(200, "success", "User deleted successfully");
        } else if (model === "recipe") {
            const result = Promise.all([
                await Recipe.findByIdAndDelete(id),
                await Comment.deleteMany({ recipe_id: id }),
                await Like.deleteMany({ recipe_id: id }),
                await Save.deleteMany({ recipe_id: id }),
            ]);

            console.log(result);

            if (!result) {
                return response.send(404, "fail", "Recipe not found");
            }

            response.send(200, "success", "Recipe deleted successfully");
        } else {
            return response.send(400, "fail", "Invalid request");
        }
    } catch (error) {
        console.error(error);
        exceptionLogger.error(error);
        response.send(500, "fail", "Internal Server Error");
    }
});

module.exports = { GetAllDashBoardStats, DeleteData };
