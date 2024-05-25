const blogService = require("../services/blogService");
const SnowFlakeId = require("../utils/SnowFlakeIdGenerator");
const dateFunction = require("../utils/Date");

// 新增--帖子
const insertBlog = (req, res, next) => {
  const { title, content, category, coverUrl, user_id } = req.body;

  const snowFlakeId = new SnowFlakeId({ WorkerId: 1 });
  const id = snowFlakeId.NextId();

  const create_time = dateFunction();

  blogService.insertBlog(
    id,
    title,
    content,
    category,
    coverUrl,
    create_time,
    user_id,
    (err, result) => {
      if (err) {
        return res.send({ state: 1, message: err });
      }
      return res.send({ state: 0, message: "新增成功", data: result });
    }
  );
};

// 新增--评论
const insertComment = (req, res, next) => {
  const { content, publisher_id, nickname, bn_id, pid, pname, category } =
    req.body;

  const snowFlakeId = new SnowFlakeId({ WorkerId: 1 });
  const id = snowFlakeId.NextId();

  const create_time = dateFunction();

  blogService.insertComment(
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

  blogService.likeBlog(comment_id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "点赞成功", data: result });
  });
};

// 删除
const deleteBlog = (req, res, next) => {
  const { id } = req.body;
  blogService.deleteBlog(id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "删除成功" });
  });
};

// 查询--条件筛选
const getBlog = (req, res, next) => {
  let { keyword, category, create_time, page, pageSize } = req.query;

  page = page == null ? 1 : page;
  pageSize = pageSize == null ? null : pageSize;
  category = category == null ? 0 : category;
  create_time = create_time == null ? "" : create_time;
  keyword = keyword == null ? "" : keyword;

  blogService.getBlog(
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
const getBlogById = (req, res, next) => {
  const { id } = req.query;
  blogService.getBlogById(id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

// 查询--分类
const getBlogCategories = (req, res, next) => {
  blogService.getBlogCategories((err, blogArr) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: blogArr });
  });
};

// 查询--通过id查询帖子评论
const getBlogCommentsById = (req, res, next) => {
  const { id } = req.query;
  blogService.getBlogCommentsById(id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

// 新增--帖子分类
const insertBlogCategories = (req, res, next) => {
  const { name, state } = req.query;
  blogService.insertBlogCategories(name, state, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "新增成功" });
  });
};

// 删除--帖子分类
const deleteBlogCategories = (req, res, next) => {
  const { id } = req.body;
  blogService.deleteBlogCategories(id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "删除成功" });
  });
};

// 修改--帖子分类
const updateBlogCategories = (req, res, next) => {
  const { id, name, state } = req.query;
  blogService.updateBlogCategories(id, name, state, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "更新成功" });
  });
};

// 查询帖子各分类数量
const getBlogCategoriesCount = (req, res, next) => {
  blogService.getBlogCategoriesCount((err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

module.exports = {
  insertBlog,
  insertComment,
  likeBlog,
  getBlog,
  getBlogById,
  deleteBlog,
  getBlogCategories,
  getBlogCommentsById,
  insertBlogCategories,
  deleteBlogCategories,
  updateBlogCategories,
  getBlogCategoriesCount,
};
