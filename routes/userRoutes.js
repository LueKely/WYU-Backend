const express = require("express");
const router = express.Router();

const {
    GetUserFullInfo,
    EditUserInfo,
} = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");

router.use(validateToken);
router.get("/", GetUserFullInfo);
router.put("/edit", EditUserInfo);

module.exports = router;
