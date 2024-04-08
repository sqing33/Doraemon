const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

// 网页端查询新闻列表
router.get("/", newsController.getNewsList);

// 根据id新闻
router.post("/newsPage", newsController.getNewsById);

module.exports = router;
