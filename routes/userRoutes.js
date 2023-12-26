const express = require("express");
const router = express.Router();

const {
    GetUserFullInfo,
    EditUserInfo,
} = require("../controllers/userController");

router.get("/", GetUserFullInfo);
router.put("/edit", EditUserInfo);

module.exports = router;
