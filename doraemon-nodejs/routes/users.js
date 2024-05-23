var express = require("express");
var router = express.Router();
const userController = require("../controllers/usersController");
const authenticateToken = require("../utils/authenticateToken");

// 获取邮箱验证码
router.post("/emailCode", authenticateToken, userController.postCode);

// 用户注册
router.post("/regist", userController.registUser);

// 用户登录
router.post("/login", userController.loginUser);

// 进入用户信息
router.post("/info", userController.goToUserInfo);

// 收藏
router.post("/collect", authenticateToken, userController.doCollect);

// 获取用户信息
router.post("/getUserInfo", authenticateToken, userController.getUserInfo);

// 获取用户博客列表
router.post(
  "/getUserBlogList",
  authenticateToken,
  userController.getUserBlogList
);

// 获取用户收藏列表
router.post(
  "/getCollectionList",
  authenticateToken,
  userController.getCollectionList
);

// 修改用户头像
router.post("/updateAvatar", authenticateToken, userController.updateAvatar);

// 修改用户信息
router.post(
  "/updateUserInfo",
  authenticateToken,
  userController.updateUserInfo
);

// 修改密码、手机号、邮箱
router.post("/updateAccount", authenticateToken, userController.updateAccount);

// 用户反馈
router.post("/feedback", authenticateToken, userController.feedback);

// 获取用户反馈列表
router.post(
  "/getFeedbackList",
  authenticateToken,
  userController.getFeedbackList
);

// 删除用户反馈
router.post(
  "/deleteFeedback",
  authenticateToken,
  userController.deleteFeedback
);

module.exports = router;
