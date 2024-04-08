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
    return res.send({ state: 0, message: "新增成功" });
  });
};

// 新增文章
const insertBlog = (req, res, next) => {
  const { title, content, region, coverUrl, publsher_id } = req.body;
  const categoryId = region;
  blogService.insertBlog(
    title,
    content,
    categoryId,
    coverUrl,
    publsher_id,
    (err, result) => {
      if (err) {
        return res.send({ state: 1, message: err });
      }
      return res.send({ state: 0, message: "新增成功", data: result });
    }
  );
}; 

// 根据条件查询文章
const getBlogs = (req, res, next) => {
  let { keyword, categoryId, create_time, page, pageSize, length } = req.query;

  page = page == null ? 1 : page;
  pageSize = pageSize == null ? null : pageSize;
  categoryId = categoryId == null ? 0 : categoryId;
  create_time = create_time == null ? "" : create_time;
  keyword = keyword == null ? "" : keyword;
  length = length == null ? 0 : length;

  blogService.getBlogs(
    page,
    pageSize,
    categoryId,
    keyword,
    create_time,
    length,
    (err, result) => {
      if (err) {
        return res.send({ state: 1, message: err });
      }
      return res.send({ state: 0, message: "查询成功", data: result });
    }
  );
};

// 根据id查询文章
const getBlogById = (req, res, next) => {
  const { id } = req.query;
  blogService.getBlogById(id, (err, result) => {
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
  getBlogById,
};
