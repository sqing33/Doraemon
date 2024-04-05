const blogService = require("../services/blogService");

// 查询文章分类
const getBlogCategories = (req, res, next) => {
  blogService.getBlogCategories((err, blogArr) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: blogArr });
  });
};

// 新增文章分类
const insertBlogCategories = (req, res, next) => {
  const { name, state } = req.query;
  blogService.insertBlogCategories(name, state, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "新增成功", data: result });
  });
};

// 新增文章
const insertBlog = (req, res, next) => {
  const { title, content, region } = req.body;
  const categoryId = region;
  blogService.insertBlog(title, content, categoryId, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "新增成功", data: result });
  });
};

// 查询文章
const getBlogs = (req, res, next) => {
  let { keyword, categoryId, page, pageSize } = req.query;

  page = page == null ? 1 : page;
  pageSize = pageSize == null ? null : pageSize;
  categoryId = categoryId == null ? 0 : categoryId;
  keyword = keyword == null ? "" : keyword;

  blogService.getBlogs(page, pageSize, categoryId, keyword, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

module.exports = {
  getBlogCategories,
  insertBlogCategories,
  insertBlog,
  getBlogs,
};
