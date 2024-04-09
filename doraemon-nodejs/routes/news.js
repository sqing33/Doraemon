const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

// 查询--条件筛选
router.post("/", newsController.getNews);

// 查询--通过id
router.post("/newsPage", newsController.getNewsById);

// 查询--分类
router.get("/categories", newsController.getNewsCategories);

module.exports = router;
