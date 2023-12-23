const express = require("express");
const router = express.Router();

const {
    GetUserFullInfo,
    GetUserPosts,
    GetUserSavedPosts,
    EditUserInfo,
} = require("../controllers/userController");

router.get("/", GetUserFullInfo);
router.get("/posts", GetUserPosts);
router.get("/saved-posts", GetUserSavedPosts);
router.put("/edit", EditUserInfo);

module.exports = router;
