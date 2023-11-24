const mongoose = require("mongoose");

const LikeSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        recipe_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Like", LikeSchema);
