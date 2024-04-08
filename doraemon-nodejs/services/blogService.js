const { mysqlDb } = require("../db");
const SnowFlakeId = require("../utils/SnowFlakeIdGenerator");
const dateFunction = require("../utils/Date");
const LZString = require("lz-string");

// 查询文章分类
const getBlogCategories = (callback) => {
  const sql = "SELECT * FROM blog_categories";
  mysqlDb.query(sql, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
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
const insertBlog = (
  title,
  content,
  categoryId,
  coverUrl,
  publsher_id,
  callback
) => {
  const snowFlakeId = new SnowFlakeId({ WorkerId: 1 });
  const id = snowFlakeId.NextId();

  const sql =
    "INSERT INTO blog SET id=?, title=?, content=?, category_id=?, coverUrl=?, publisher_id=?, create_time=? ";
  mysqlDb.query(
    sql,
    [id, title, content, categoryId, coverUrl, publsher_id, dateFunction()],
    (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    }
  );
};

// 根据条件查询文章
const getBlogs = (
  page,
  pageSize,
  categoryId,
  keyword,
  create_time,
  length,
  callback
) => {
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

  if (create_time != "") {
    sqlCondition.push(" DATE(create_time) = ? ");
    sqlParams.push(create_time);
  }

  let whereSqlStr = "";
  if (sqlCondition.length > 0) {
    whereSqlStr = " WHERE " + sqlCondition.join(" AND ");
    console.log(whereSqlStr);
  }

  let sql;

  if (pageSize !== null) {
    sql = " SELECT * FROM blog " + whereSqlStr + " LIMIT ?,? ";
  } else if (page == 1 && pageSize == null) {
    sql = " SELECT * FROM blog ";
  }

  console.log(sql);

  let params = sqlParams.concat([(page - 1) * pageSize, parseInt(pageSize)]);

  let blogArr = [];
  let total;

  mysqlDb.query(sql, params, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log(result);

    if (length === 0) {
      blogArr = result;
    } else if (length) {
      blogArr = result.map((item) => {
        item.content = LZString.decompressFromBase64(item.content);
        item.content = item.content.slice(0, 99) + "...";
        item.content = LZString.compressToBase64(item.content);
        return item;
      });
    }

    if (page == 1 && pageSize == null) {
      callback(null, blogArr);
    } else {
      let sql2 = " SELECT count(*) AS total FROM blog " + whereSqlStr;

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

const getBlogById = (id, callback) => {
  const sql = "SELECT * FROM blog WHERE id = ? ";
  mysqlDb.query(sql, [id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result[0]);
  });
};

module.exports = {
  getBlogCategories,
  insertBlogCategories,
  insertBlog,
  getBlogs,
  getBlogById,
};
