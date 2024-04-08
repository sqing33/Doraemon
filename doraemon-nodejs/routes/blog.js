const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

// 发表文章
router.post("/blogInsert", blogController.insertBlog);

// 根据条件查询文章
router.post("/", blogController.getBlogs); 

// 查询文章分类
router.get("/categories", blogController.getBlogCategories);

// 根据id查询文章
router.post("/blogPage", blogController.getBlogById);

// 发表文章
router.post("/postBlog", blogController.insertBlog);

module.exports = router;
