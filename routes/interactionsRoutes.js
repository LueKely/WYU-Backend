const express = require("express");
const router = express.Router();

const {
    LikeController,
    CommentController,
    SaveController,
} = require("../controllers/interactionController");
const validateToken = require("../middlewares/validateToken");

router.use(validateToken);
router.post("/like", LikeController);
router.post("/comment", CommentController);
router.post("/save", SaveController);

module.exports = router;
