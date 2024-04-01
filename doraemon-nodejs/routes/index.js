const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

// 网页端查询新闻列表
router.get("/news", newsController.getNewsList);

// 网页端查询新闻详细信息
router.post("/newsPage", newsController.getNewsById);

module.exports = router;
