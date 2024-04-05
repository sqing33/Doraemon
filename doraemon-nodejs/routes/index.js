const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const blogController = require("../controllers/blogController");

// 网页端查询新闻列表
router.get("/news", newsController.getNewsList);

// 网页端查询新闻详细信息
router.post("/newsPage", newsController.getNewsById);

// 发表文章
router.post("/blogInsert", blogController.insertBlog);

// 查询文章
router.post("/blogs", blogController.getBlogs);

module.exports = router;
