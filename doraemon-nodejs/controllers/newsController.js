const newsService = require("../services/newsService");
const dateFunction = require("../utils/Date");
const SnowFlakeId = require("../utils/SnowFlakeIdGenerator");

// 新增--评论
const insertComment = (req, res, next) => {
  const { content, publisher_id, nickname, bn_id, pid, pname, category } =
    req.body;

  const snowFlakeId = new SnowFlakeId({ WorkerId: 1 });
  const id = snowFlakeId.NextId();

  const create_time = dateFunction();

  newsService.insertComment(
    id,
    content,
    publisher_id,
    nickname,
    bn_id,
    pid,
    pname,
    category,
    create_time,
    (err, result) => {
      if (err) {
        return res.send({ state: 1, message: err });
      }
      return res.send({ state: 0, message: "新增成功", data: result });
    }
  );
};

// 点赞
const likeBlog = (req, res, next) => {
  const { comment_id } = req.body;

  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwtKey.key, (err) => {
      if (err) {
        return res.sendStatus(403);
      }

      newsService.likeBlog(comment_id, (err, result) => {
        if (err) {
          return res.send({ state: 1, message: err });
        }
        return res.send({ state: 0, message: "点赞成功", data: result });
      });
    });
  } else {
    res.sendStatus(401);
  }
};

// 查询--条件筛选
const getNews = (req, res, next) => {
  let { keyword, category, create_time, page, pageSize } = req.query;

  page = page == null ? 1 : page;
  pageSize = pageSize == null ? null : pageSize;
  category = category == null ? 0 : category;
  create_time = create_time == null ? "" : create_time;
  keyword = keyword == null ? "" : keyword;

  newsService.getNews(
    page,
    pageSize,
    category,
    keyword,
    create_time,

    (err, result) => {
      if (err) {
        return res.send({ state: 1, message: err });
      }
      return res.send({ state: 0, message: "查询成功", data: result });
    }
  );
};

// 查询--通过id
const getNewsById = (req, res, next) => {
  const id = req.query.id;
  newsService.getNewsById(id, (err, news) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: news });
  });
};

// 查询--分类
const getNewsCategories = (req, res, next) => {
  newsService.getNewsCategories((err, categories) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: categories });
  });
};

// 查询--通过id查询帖子评论
const getBlogCommentsById = (req, res, next) => {
  const { id } = req.query;
  newsService.getBlogCommentsById(id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

// 新增新闻
const insertNews = (req, res, next) => {
  const { title, content, coverUrl, category, state } = req.body;

  const snowFlakeId = new SnowFlakeId({ WorkerId: 1 });
  const id = snowFlakeId.NextId();

  const date = dateFunction();

  newsService.insertNews(
    id,
    title,
    content,
    coverUrl,
    category,
    date,
    state,
    (err, result) => {
      if (err) {
        return res.send({ state: 1, message: err });
      }
      return res.send({ state: 0, message: "新增成功", data: result });
    }
  );
};

// 删除新闻
const deleteNews = (req, res, next) => {
  const id = req.body.id;
  newsService.deleteNews(id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "删除成功", data: result });
  });
};

// 更新新闻
const updateNews = (req, res, next) => {
  const { id, title, content, coverUrl, category_id, state } = req.body;

  newsService.updateNews(
    id,
    title,
    content,
    coverUrl,
    category_id,
    state.toString(),
    (err, result) => {
      if (err) {
        return res.send({ state: 1, message: err });
      }
      return res.send({ state: 0, message: "更新成功", data: result });
    }
  );
};

// 图片上传
const upload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ errno: 1, message: "上传失败" });
  }
  const imagesUrl =
    "http://localhost:3000/uploads/images/news/" + req.file.filename;
  res.send({
    errno: 0,
    data: {
      url: imagesUrl,
      alt: "",
      href: req.file.filename,
    },
  });
};

module.exports = {
  insertComment,
  likeBlog,
  getNews,
  getNewsById,
  getNewsCategories,
  getBlogCommentsById,
  insertNews,
  deleteNews,
  updateNews,
  upload,
};
