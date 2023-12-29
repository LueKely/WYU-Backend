const asyncHandler = require("express-async-handler");

// Import Local Modules
const { User, Recipe, Like, Save } = require("../models/index");
const FieldsValidator = require("../helpers/FieldsValidator");
const ResponseBuilder = require("../helpers/ResponseBuilder");
const { exceptionLogger } = require("../logs");

const GetUserFullInfo = asyncHandler(async (req, res) => {
    const response = new ResponseBuilder(req, res);
    const fields = new FieldsValidator(req.query);

    // Check if the fields in response are accepted
    if (!fields.areResponseKeysAccepted(req.query)) {
        response.send(400, "fail", "The provided query name is invalid");
        return;
    }

    // Check if any required fields are empty
    if (!fields.areResponseValuesEmpty(req.query)) {
        response.send(400, "fail", "Some query have empty values");
        return;
    }

    try {
        const { id, isSelfVisit } = req.query;

        const user = await User.findById(id).select("-password -__v");

        if (!user) {
            response.send(404, "fail", "User not found");
            return;
        }

        const [recipes, listOflikes, listOfSaves] = await Promise.all([
            Recipe.find({})
                .sort({ updatedAt: -1 })
                .populate("user_id", "username"),
            Like.find({}),
            Save.find({ user_id: id }),
        ]);

        /* if (!recipes || recipes.length === 0) {
            const message = !recipes
                ? "Failed to fetch recipes"
                : "No recipes found";
            response.send(
                !recipes ? 404 : 200,
                !recipes ? "fail" : "success",
                message
            );
            return;
        } */

        let userSavedRecipes = [];
        if (Number(isSelfVisit) === 1) {
            // If the user is visiting his own profile, add the saved recipes
            userSavedRecipes = listOfSaves.map((save) => {
                const matchingRecipe = recipes.find((recipe) =>
                    recipe._id.equals(save.recipe_id)
                );

                if (matchingRecipe) {
                    return {
                        ...matchingRecipe.toObject(),
                        saves: listOfSaves.filter((save) =>
                            save.recipe_id.equals(matchingRecipe._id)
                        ),
                        likes: listOflikes.filter((like) =>
                            like.recipe_id.equals(matchingRecipe._id)
                        ),
                    };
                }
            });
        }

        const combinedUserInformations = {
            user: user.toObject(),
            posts: recipes
                ? recipes
                      .filter((recipe) => recipe.user_id._id.equals(user._id))
                      .map((recipe) => {
                          const { _id, username } = recipe.user_id;
                          const { user_id, ...restOfRecipeData } =
                              recipe.toObject();

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
                      })
                : [],
            saves: userSavedRecipes ? userSavedRecipes : [],
        };

        response.send(
            200,
            "success",
            "User info fetched successfully",
            combinedUserInformations
        );
        return;
    } catch (error) {
        // Log the error
        console.log(error);
        exceptionLogger.error(error);

        // Handle the error and send an appropriate response
        response.send(500, "fail", "Internal Server Error");
    }
});

const EditUserInfo = asyncHandler(async (req, res) => {});

module.exports = {
    GetUserFullInfo,
    EditUserInfo,
};
