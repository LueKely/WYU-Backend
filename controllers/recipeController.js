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

const GetRecipe = asyncHandler(async (req, res) => {
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    if (req.query.hasOwnProperty("id")) {
        const { id } = req.query;

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

        // Proceeds to getting a recipe by id
        try {
            const recipe = await Recipe.findById(id).populate(
                "user_id",
                "username"
            );

            if (!recipe) {
                response.send(404, "fail", "Recipe not found");
                return;
            }

            const [recipeLikes, recipeComments, recipeSaves, users] =
                await Promise.all([
                    Like.find({ recipe_id: id }),
                    Comment.find({ recipe_id: id }).sort({
                        updatedAt: -1,
                    }),
                    Save.find({ recipe_id: id }),
                    User.find({}),
                ]);

            if (!recipeLikes && !recipeComments) {
                response.send(404, "fail", "Failed to fetch data");
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
                const user = users.find((user) =>
                    user._id.equals(comment.user_id)
                );

                return {
                    _id: comment._id,
                    user_id: comment.user_id,
                    username: user ? user.username : "Unknown User",
                    user_comment: comment.user_comment,
                };
            });

            const modifiedRecipe = {
                _id: recipe._id,
                user_id: recipe.user_id._id,
                username: recipe.user_id.username,
                recipe_name: recipe.recipe_name,
                image_url: recipe.image_url,
                difficulty: recipe.difficulty,
                cooking_time: recipe.cooking_time,
                tags: recipe.tags,
                description: recipe.description,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                createdAt: recipe.createdAt,
                updatedAt: recipe.updatedAt,
                __v: recipe.__v,
                likes,
                comments,
                saves,
            };

            response.send(200, "success", "Recipe found", modifiedRecipe);
            return;
        } catch (error) {
            // Log the error
            console.error(error);
            exceptionLogger.error(error);

            // Handle the error and send an appropriate response
            response.send(500, "error", "Internal Server Error");
        }
    } else {
        try {
            const [recipes, listOflikes, listOfSaves] = await Promise.all([
                Recipe.find({})
                    .sort({ updatedAt: -1 })
                    .populate("user_id", "username"),
                Like.find({}),
                Save.find({}),
            ]);

            if (!recipes) {
                response.send(404, "fail", "No recipes found");
                return;
            }

            const modifiedRecipes = recipes.map((recipe) => ({
                _id: recipe._id,
                user_id: recipe.user_id._id,
                username: recipe.user_id.username,
                recipe_name: recipe.recipe_name,
                image_url: recipe.image_url,
                difficulty: recipe.difficulty,
                cooking_time: recipe.cooking_time,
                tags: recipe.tags,
                description: recipe.description,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                createdAt: recipe.createdAt,
                updatedAt: recipe.updatedAt,
                __v: recipe.__v,
                likes: listOflikes
                    .map((like) =>
                        like.recipe_id.equals(recipe._id) ? like : null
                    )
                    .filter((like) => like !== null),
                saves: listOfSaves
                    .map((save) =>
                        save.recipe_id.equals(recipe._id) ? save : null
                    )
                    .filter((save) => save !== null),
            }));

            response.send(200, "success", "Recipes found", modifiedRecipes);
            return;
        } catch (error) {
            console.error(error);
            // Log the error
            exceptionLogger.error(error);

            // Handle the error and send an appropriate response
            response.send(500, "error", "Internal Server Error");
        }
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
    const {
        recipe_name,
        image_url,
        difficulty,
        cooking_time,
        tags,
        description,
        ingredients,
        instructions,
    } = req.body;
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req);

    // Check if the desctructured fields are in the request body
    if (
        !fields.areKeysInRequest({
            recipe_name,
            difficulty,
            image_url,
            cooking_time,
            tags,
            description,
            ingredients,
            instructions,
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

    // Proceeds to making a new recipe
    try {
        const user_id = req.user.id;

        if (!user_id) {
            response.send(400, "fail", "User not found");
            return;
        }

        const newRecipe = new Recipe({
            user_id,
            recipe_name,
            image_url,
            difficulty,
            tags,
            cooking_time,
            description,
            ingredients,
            instructions,
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

module.exports = { GetRecipe, CreateRecipe };
