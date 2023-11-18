const express = require("express");
const router = express.Router();

const { GetRecipe, CreateRecipe } = require("../controllers/recipeController");
const validateToken = require("../middlewares/validateToken");

router.use(validateToken);
router.get("/", GetRecipe);
router.post("/create", CreateRecipe);

module.exports = router;
