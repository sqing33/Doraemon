const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const newsController = require("../controllers/newsController");
const usersController = require("../controllers/usersController");
const multer = require("multer");
const crypto = require("crypto");

// 管理员管理用户信息
router.get("/users", usersController.getUsers);

// 管理员查询文章分类
router.get("/blog/categories", blogController.getBlogCategories);

// 管理员插入文章分类
router.post("/blog/categoryInsert", blogController.insertBlogCategories);

// 管理员查询文章列表
// router.post("/blog", blogController.getBlogByPage);

// 管理员查询新闻列表
router.post("/news", newsController.getNewsByPage);

// 管理员插入新闻
router.post("/newsInsert", newsController.insertNews);

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
