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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
