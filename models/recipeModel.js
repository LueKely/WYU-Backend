const mongoose = require("mongoose");

const RecipeSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        recipe_name: {
            type: String,
            required: [true, "Recipe name field is required"],
        },
        image_url: {
            type: String,
            required: [true, "Image Url field is required"],
        },
        difficulty: {
            type: String,
            required: [true, "Difficulty field is required"],
            enum: ["easy", "medium", "hard"],
        },
        cooking_time: {
            type: String,
            required: [true, "Cooking Time field is required"],
        },
        categories: {
            type: Array,
            required: [true, "Categories field is required"],
        },
        description: {
            type: String,
            required: [true, "Description field is required"],
        },
        ingredients: {
            type: Array,
            required: [true, "Ingredients field is required"],
        },
        instructions: {
            type: Array,
            required: [true, "Instructions field is required"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
