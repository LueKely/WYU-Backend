const express = require("express");
const router = express.Router();

const {
    GetAllDashBoardStats,
    DeleteData,
} = require("../controllers/adminControllers");

router.get("/", GetAllDashBoardStats);
router.delete("/", DeleteData);

module.exports = router;
