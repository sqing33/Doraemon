const { mysqlDb } = require("../db");
const SnowFlakeId = require("../SnowFlakeIdGenerator");

// 查询文章分类
const getBlogCategories = (callback) => {
  const sql = "SELECT * FROM blog_categories";
  mysqlDb.query(sql, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log(result);
    callback(null, result);
  });
};

// 新增文章分类
const insertBlogCategories = (name, state, callback) => {
  const snowFlakeId = new SnowFlakeId({ WorkerId: 1 });
  const id = snowFlakeId.NextId();

  const sql = "INSERT INTO blog_categories SET id=?, name=?, state=?";
  mysqlDb.query(sql, [id, name, state], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log(result);
    callback(null, result);
  });
};

// 新增文章
const insertBlog = (title, content, categoryId, callback) => {
  const snowFlakeId = new SnowFlakeId({ WorkerId: 1 });
  const id = snowFlakeId.NextId();

  const sql = "INSERT INTO blog SET id=?, title=?, content=?, category_id=?";
  mysqlDb.query(sql, [id, title, content, categoryId], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log(result);
    callback(null, result);
  });
};

// 查询文章
const getBlogs = (page, pageSize, categoryId, keyword, callback) => {
  let sqlParams = [];
  let sqlCondition = [];
  if (categoryId != 0) {
    sqlCondition.push(" category_id = ? ");
    sqlParams.push(categoryId);
  }

  if (keyword != "") {
    sqlCondition.push(" (title LIKE ? OR content LIKE ?) ");
    sqlParams.push("%" + keyword + "%");
    sqlParams.push("%" + keyword + "%");
  }

  let whereSqlStr = "";
  if (sqlCondition.length > 0) {
    whereSqlStr = " WHERE " + sqlCondition.join(" AND ");
  }

  let sql;

  if (pageSize !== null) {
    sql =
      " SELECT id, category_id, title, content FROM blog " +
      sqlCondition +
      " LIMIT ?,? ";
  } else if (page == 1 && pageSize == null) {
    sql = " SELECT id, category_id, title, content FROM blog ";
  }

  let params = sqlParams.concat([(page - 1) * pageSize, parseInt(pageSize)]);

  let blogArr = [];
  let total;

  mysqlDb.query(sql, params, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    blogArr = result;

    if (page == 1 && pageSize == null) {
      callback(null, blogArr);
    } else {
      let sql2 = " SELECT count(*) AS total FROM blog " + sqlCondition;

      mysqlDb.query(sql2, sqlParams, (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        total = result[0].total;
        callback(null, { blogArr, total });
      });
    }
  });
};

module.exports = {
  getBlogCategories,
  insertBlogCategories,
  insertBlog,
  getBlogs,
};
