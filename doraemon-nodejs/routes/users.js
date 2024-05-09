var express = require("express");
var router = express.Router();
const userController = require("../controllers/usersController");

// 获取邮箱验证码
router.post("/emailCode", userController.postCode);

// 用户注册
router.post("/regist", userController.registUser);

// 用户登录
router.post("/login", userController.loginUser);

// 进入用户信息
router.post("/info", userController.goToUserInfo);

// 收藏
router.post("/collect", userController.doCollect);

// 获取用户信息
router.post("/getUserInfo", userController.getUserInfo);

// 获取用户收藏列表
router.post("/getCollectionList", userController.getCollectionList);

// 修改用户头像
router.post("/updateAvatar", userController.updateAvatar);

// 修改用户信息
router.post("/updateUserInfo", userController.updateUserInfo);

// 修改密码、手机号、邮箱
router.post("/updateAccount", userController.updateAccount);

module.exports = router;
