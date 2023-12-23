const asyncHandler = require("express-async-handler");

// Import Local Modules
const Like = require("../models/interactions/likesModel");
const Comment = require("../models/interactions/commentsModel");
const Save = require("../models/interactions/saveModel");
const FieldsValidator = require("../helpers/FieldsValidator");
const ResponseBuilder = require("../helpers/ResponseBuilder");
const { exceptionLogger } = require("../logs");

const GetUserFullInfo = asyncHandler(async (req, res) => {});

const GetUserPosts = asyncHandler(async (req, res) => {});

const GetUserSavedPosts = asyncHandler(async (req, res) => {});

const EditUserInfo = asyncHandler(async (req, res) => {});

module.exports = {
    GetUserFullInfo,
    GetUserPosts,
    GetUserSavedPosts,
    EditUserInfo,
};
