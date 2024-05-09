const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

// 新增评论
router.post("/postComment", newsController.insertComment);

// 点赞
router.post("/like", newsController.likeBlog);

// 查询--条件筛选
router.post("/", newsController.getNews);

// 查询--通过id
router.post("/newsPage", newsController.getNewsById);

// 查询--分类
router.get("/categories", newsController.getNewsCategories);

// 查询--通过id查询帖子评论
router.post("/getComments", newsController.getBlogCommentsById);

module.exports = router;
