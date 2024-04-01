var express = require("express");
var router = express.Router();
const userController = require("../controllers/usersController");

// 用户注册
router.post("/regist", userController.registUser);

module.exports = router;
