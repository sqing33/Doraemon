const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const blogController = require("../controllers/blogController");

// 网页端查询新闻列表
router.get("/news", newsController.getNewsList);

// 根据id新闻
router.post("/newsPage", newsController.getNewsById);

// 发表文章
router.post("/blogInsert", blogController.insertBlog);

// 根据条件查询文章
router.post("/blogs", blogController.getBlogs);

// 查询文章分类
router.get("/blog/categories", blogController.getBlogCategories);

// 根据id查询文章
router.post("/blog/blogPage", blogController.getBlogById);

// 发表文章
router.post("/blog/postBlog", blogController.insertBlog);

module.exports = router;
