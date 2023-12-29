const User = require("./userModel");
const Recipe = require("./recipeModel");
const Like = require("./interactions/likesModel");
const Save = require("./interactions/saveModel");
const Comment = require("./interactions/commentsModel");

module.exports = { User, Recipe, Like, Save, Comment };
