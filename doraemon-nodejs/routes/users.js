var express = require("express");
var router = express.Router();
const userController = require("../controllers/usersController");

// 获取邮箱验证码
router.post("/emailCode", userController.postCode);

// 用户注册
router.post("/regist", userController.registUser);

// 用户登录
router.post("/login", userController.loginUser);

// 用户信息
router.post("/info", userController.getUserInfo);

module.exports = router;
