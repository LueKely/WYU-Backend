const express = require("express");
const router = express.Router();

const {
    GetUsers,
    RegisterUser,
    LoginUser,
    LogoutUser,
} = require("../controllers/userController");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", LogoutUser);

module.exports = router;
