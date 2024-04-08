const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

// 网页端查询新闻列表
router.get("/", newsController.getNewsList);

// 根据id新闻
router.post("/newsPage", newsController.getNewsById);

// 查询新闻分类
router.get("/categories", newsController.getNewsCategories);

// 根据条件查询新闻
router.post("/", newsController.getNews);

module.exports = router;
