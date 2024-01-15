const asyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();

const {
    GetAllRecipes,
    GetRecipeById,
    GetRecipeByCategory,
    GetRecipeByName,
    CreateRecipe,
    UpdateRecipe,
} = require("../controllers/recipeController");
const validateToken = require("../middlewares/validateToken");

const distributorRecipeRoutes = asyncHandler((req, res) => {
    const { id, category, name } = req.query;

    if (id) {
        return GetRecipeById(req, res);
    } else if (category) {
        return GetRecipeByCategory(req, res);
    } else if (name) {
        return GetRecipeByName(req, res);
    } else {
        return GetAllRecipes(req, res);
    }
});

router.use(validateToken);
router.get("/", distributorRecipeRoutes);
router.post("/create", CreateRecipe);
router.put("/update", UpdateRecipe);

module.exports = router;
