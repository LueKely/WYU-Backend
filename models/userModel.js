const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username field is required"],
            unique: [true, "Username is already used"],
        },
        email: {
            type: String,
            required: [true, "Email field is required"],
            unique: [true, "Email address already registered"],
        },
        password: {
            type: String,
            required: [true, "Password field is required"],
        },
        first_name: {
            type: String,
            required: [true, "First name field is required"],
        },
        last_name: {
            type: String,
            required: [true, "Last name field is required"],
        },
        user_bio: {
            type: String,
            default: "",
        },
        fb_username: {
            type: String,
            default: "",
        },
        ig_username: {
            type: String,
            default: "",
        },
        twt_username: {
            type: String,
            default: "",
        },
        user_profile_image: {
            type: String,
            default: "",
        },
        user_bg_image: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
