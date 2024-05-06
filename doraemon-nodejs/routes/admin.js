const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const newsController = require("../controllers/newsController");
const usersController = require("../controllers/usersController");
const multer = require("multer");
const crypto = require("crypto");

// blog管理--删除帖子
router.post("/blog/delete", blogController.deleteBlog);
// blog管理--查询帖子--条件筛选
router.post("/blog", blogController.getBlog);
// blog管理--新增帖子分类
router.post("/blog/categoryInsert", blogController.insertBlogCategories);
// blog管理--查询帖子分类
router.get("/blog/categories", blogController.getBlogCategories);

// news管理--新增新闻
router.post("/news/insert", newsController.insertNews);
// news管理--删除新闻
router.post("/news/delete", newsController.deleteNews);
// news管理--修改新闻
router.post("/news/update", newsController.updateNews);
// news管理--查询新闻--条件筛选
router.post("/news", newsController.getNews);
// news管理--查询新闻分类
router.get("/news/categories", newsController.getNewsCategories);

// user管理
router.get("/users", usersController.getUsers);

// 图片上传

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/news");
  },
  filename: (req, file, cb) => {
    // 生成日期时间
    const date = new Date(Date.now());
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    // 生成随机字符串
    const randomString = crypto.randomBytes(8).toString("hex");
    // 生成新文件名
    const newFilename = `news_${formattedDateTime}_${randomString}_${file.originalname}`;

    cb(null, newFilename);
  },
});
const upload = multer({ storage: storage });
router.post("/upload", upload.single("file"), newsController.upload);

module.exports = router;
