const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

// 新增帖子
router.post("/postBlog", blogController.insertBlog);

// 新增评论
router.post("/postComment", blogController.insertComment);

// 点赞
router.post("/like", blogController.likeBlog);

/* // 删除
router.post("/delete", blogController.deleteBlog);

// 修改
router.post("/update", blogController.updateBlog); */

// 查询--条件筛选
router.post("/", blogController.getBlog);
// 查询--通过id
router.post("/blogPage", blogController.getBlogById);
// 查询--分类
router.get("/categories", blogController.getBlogCategories);
// 查询--通过id查询帖子评论
router.post("/getComments", blogController.getBlogCommentsById);

module.exports = router;
