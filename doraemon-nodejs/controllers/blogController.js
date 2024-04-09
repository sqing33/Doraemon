const blogService = require("../services/blogService");

// 新增
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
  let { keyword, categoryId, create_time, page, pageSize, length } = req.query;

  console.log(req.query);

  page = page == null ? 1 : page;
  pageSize = pageSize == null ? null : pageSize;
  categoryId = categoryId == null ? 0 : categoryId;
  create_time = create_time == null ? "" : create_time;
  keyword = keyword == null ? "" : keyword;
  length = length == null ? 0 : length;

  blogService.getBlog(
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

module.exports = {
  insertBlog,
  getBlog,
  getBlogById,
  deleteBlog,
  getBlogCategories,
  insertBlogCategories,
};
