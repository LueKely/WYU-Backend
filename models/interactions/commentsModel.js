const mongoose = require("mongoose");

const CommentsSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: {
            type: String,
            required: [true, "Username field is required"],
        },
        recipe_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
        },
        user_comment: {
            type: String,
            required: [true, "Comment field is required"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Comment", CommentsSchema);
