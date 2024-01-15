const express = require("express");
const router = express.Router();

const {
    RegisterUser,
    LoginUser,
} = require("../controllers/authenticationController");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);

module.exports = router;
