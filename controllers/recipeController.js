// Import Modules from installed libraries
const asyncHandler = require("express-async-handler");

// Import Local Modules
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const Like = require("../models/interactions/likesModel");
const Save = require("../models/interactions/saveModel");
const Comment = require("../models/interactions/commentsModel");
const FieldsValidator = require("../helpers/FieldsValidator");
const ResponseBuilder = require("../helpers/ResponseBuilder");
const { exceptionLogger } = require("../logs");

/**
 * Controller function for retrieving all recipes
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Promise that resolves after processing the request
 */
const GetAllRecipes = asyncHandler(async (req, res) => {
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the fields in response are accepted
    if (!fields.areResponseKeysAccepted(req.query)) {
        response.send(400, "fail", "The provided query name is invalid");
        return;
    }

    // Check if any required fields are empty
    if (!fields.areResponseValuesEmpty(req.query)) {
        response.send(400, "fail", "Query value is empty");
        return;
    }

    try {
        const [recipes, listOflikes, listOfSaves] = await Promise.all([
            Recipe.find({})
                .sort({ updatedAt: -1 })
                .populate("user_id", "username"),
            Like.find({}),
            Save.find({}),
        ]);

        if (!recipes || recipes.length === 0) {
            const message = !recipes
                ? "Failed to fetch recipes"
                : "No recipes found";
            response.send(
                !recipes ? 404 : 200,
                !recipes ? "fail" : "success",
                message
            );
            return;
        }

        const combinedRecipeData = recipes.map((recipe) => {
            const { _id, username } = recipe.user_id;
            const { user_id, ...restOfRecipeData } = recipe.toObject();

            return {
                ...restOfRecipeData,
                user_id: _id,
                username,
                likes: listOflikes.filter((like) =>
                    like.recipe_id.equals(recipe._id)
                ),
                saves: listOfSaves.filter((save) =>
                    save.recipe_id.equals(recipe._id)
                ),
            };
        });

        response.send(200, "success", "Recipes found", combinedRecipeData);
        return;
    } catch (error) {
        console.error(error);
        // Log the error
        exceptionLogger.error(error);

        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

/**
 * Controller function for retrieving a recipe by its id.
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Promise that resolves after processing the request
 */
const GetRecipeById = asyncHandler(async (req, res) => {
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the fields in response are accepted
    if (!fields.areResponseKeysAccepted(req.query)) {
        response.send(400, "fail", "The provided parameter name is invalid");
        return;
    }

    // Check if any required fields are empty
    if (!fields.areResponseValuesEmpty(req.query)) {
        response.send(400, "fail", "Parameter value is empty");
        return;
    }

    // Proceeds to getting a recipe by id
    try {
        const { id } = req.query;

        const [recipe, users, recipeLikes, recipeComments, recipeSaves] =
            await Promise.all([
                Recipe.findById(id).populate("user_id", "username"),
                User.find({}),
                Like.find({ recipe_id: id }),
                Comment.find({ recipe_id: id }).sort({
                    updatedAt: -1,
                }),
                Save.find({ recipe_id: id }),
            ]);

        if (!recipe) {
            response.send(404, "fail", "Recipe not found");
            return;
        }

        if (!recipeLikes && !recipeComments) {
            response.send(404, "fail", "Failed to fetch recipe interactions");
            return;
        }

        const likes = recipeLikes.map((like) => ({
            _id: like._id,
            user_id: like.user_id,
        }));

        const saves = recipeSaves.map((save) => ({
            _id: save._id,
            user_id: save.user_id,
        }));

        const comments = recipeComments.map((comment) => {
            const user = users.find((user) => user._id.equals(comment.user_id));

            return {
                _id: comment._id,
                user_id: comment.user_id,
                username: user ? user.username : "Unknown User",
                user_comment: comment.user_comment,
            };
        });

        const { _id, username } = recipe;
        const { user_id, ...restOfRecipeData } = recipe.toObject();

        const combinedRecipeData = {
            ...restOfRecipeData,
            user_id: _id,
            username,
            likes,
            comments,
            saves,
        };

        response.send(200, "success", "Recipe found", combinedRecipeData);
        return;
    } catch (error) {
        // Log the error
        console.error(error);
        exceptionLogger.error(error);

        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

/**
 * Controller function for retrieving recipes based on a specified category
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Promise that resolves after processing the request
 */
const GetRecipeByCategory = asyncHandler(async (req, res) => {
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the fields in response are accepted
    if (!fields.areResponseKeysAccepted(req.query)) {
        response.send(400, "fail", "The provided query name is invalid");
        return;
    }

    // Check if any required fields are empty
    if (!fields.areResponseValuesEmpty(req.query)) {
        response.send(400, "fail", "Query value is empty");
        return;
    }

    const { category } = req.query;

    try {
        const [recipes, listOflikes, listOfSaves] = await Promise.all([
            Recipe.find({
                categories: { $elemMatch: { $regex: category, $options: "i" } },
            })
                .sort({ updatedAt: -1 })
                .populate("user_id", "username"),
            Like.find({}),
            Save.find({}),
        ]);

        if (!recipes || recipes.length === 0) {
            const message = !recipes
                ? "Failed to fetch recipes"
                : "No recipes found";
            response.send(
                !recipes ? 404 : 200,
                !recipes ? "fail" : "success",
                message
            );
            return;
        }

        const combinedRecipeData = recipes.map((recipe) => {
            const { _id, username } = recipe.user_id;
            const { user_id, ...restOfRecipeData } = recipe.toObject();

            return {
                ...restOfRecipeData,
                user_id: _id,
                username,
                likes: listOflikes.filter((like) =>
                    like.recipe_id.equals(recipe._id)
                ),
                saves: listOfSaves.filter((save) =>
                    save.recipe_id.equals(recipe._id)
                ),
            };
        });

        response.send(200, "success", "Recipes found", combinedRecipeData);
        return;
    } catch (error) {
        // Log the error
        console.error(error);
        exceptionLogger.error(error);

        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

/**
 * Controller function for retrieving recipes by their name.
 *
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Promise that resolves after processing the request
 */
const GetRecipeByName = asyncHandler(async (req, res) => {
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the fields in response are accepted
    if (!fields.areResponseKeysAccepted(req.query)) {
        response.send(400, "fail", "The provided query name is invalid");
        return;
    }

    // Check if any required fields are empty
    if (!fields.areResponseValuesEmpty(req.query)) {
        response.send(400, "fail", "Query value is empty");
        return;
    }

    const { name } = req.query;

    try {
        const [recipes, listOflikes, listOfSaves] = await Promise.all([
            Recipe.find({ recipe_name: { $regex: name, $options: "i" } })
                .sort({ updatedAt: -1 })
                .populate("user_id", "username"),
            Like.find({}),
            Save.find({}),
        ]);

        if (!recipes || recipes.length === 0) {
            const message = !recipes
                ? "Failed to fetch recipes"
                : `No ${name} recipes found`;
            response.send(
                !recipes ? 404 : 200,
                !recipes ? "fail" : "success",
                message,
                []
            );
            return;
        }

        const combinedRecipeData = recipes.map((recipe) => {
            const { _id, username } = recipe.user_id;
            const { user_id, ...restOfRecipeData } = recipe.toObject();

            return {
                ...restOfRecipeData,
                user_id: _id,
                username,
                likes: listOflikes.filter((like) =>
                    like.recipe_id.equals(recipe._id)
                ),
                saves: listOfSaves.filter((save) =>
                    save.recipe_id.equals(recipe._id)
                ),
            };
        });

        response.send(200, "success", "Recipes found", combinedRecipeData);
        return;
    } catch (error) {
        // Log the error
        console.error(error);
        exceptionLogger.error(error);

        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

/**
 * Controller function for creating a new recipe.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
const CreateRecipe = asyncHandler(async (req, res) => {
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the desctructured fields are in the request body
    if (!fields.areKeysInRequest(req.body)) {
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

    // Proceeds to making a new recipe
    try {
        // Get the user id that wants to create a recipe
        const user_id = req.user.id;

        if (!user_id) {
            response.send(400, "fail", "User not found");
            return;
        }

        const newRecipe = new Recipe({
            user_id,
            ...req.body,
        });

        const savedRecipe = await newRecipe.save();

        if (!savedRecipe) {
            response.send(500, "fail", "Failed to create recipe", savedRecipe);
            return;
        }

        response.send(
            201,
            "success",
            "Recipe created successfully",
            savedRecipe
        );
        return;
    } catch (error) {
        // Log the error
        console.error(error);
        exceptionLogger.error(error);
        // Handle the error and send an appropriate response
        response.send(500, "error", "Internal Server Error");
    }
});

module.exports = {
    GetAllRecipes,
    GetRecipeById,
    GetRecipeByCategory,
    GetRecipeByName,
    CreateRecipe,
};
