const { mysqlDb } = require("../db");
const SnowFlakeId = require("../utils/SnowFlakeIdGenerator");
const dateFunction = require("../utils/Date");
const LZString = require("lz-string");

// 查询--条件筛选
const getNews = (
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
  }

  let sql;

  if (pageSize !== null) {
    sql = " SELECT * FROM news " + whereSqlStr + " LIMIT ?,? ";
  } else if (page == 1 && pageSize == null) {
    sql = " SELECT * FROM news ";
  }

  let params = sqlParams.concat([(page - 1) * pageSize, parseInt(pageSize)]);

  let newsArr = [];
  let total;

  mysqlDb.query(sql, params, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (length === 0) {
      newsArr = result;
    } else if (length) {
      newsArr = result.map((item) => {
        //item.content = LZString.decompressFromBase64(item.content);
        item.content = item.content.slice(0, 99) + "...";
        //item.content = LZString.compressToBase64(item.content);
        return item;
      });
    }

    if (page == 1 && pageSize == null) {
      callback(null, newsArr);
    } else {
      let sql2 = " SELECT count(*) AS total FROM news " + whereSqlStr;

      mysqlDb.query(sql2, sqlParams, (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        total = result[0].total;
        callback(null, { newsArr, total });
      });
    }
  });
};

// 查询--通过id
const getNewsById = (id, callback) => {
  const sql = "SELECT * FROM news WHERE id = ?";
  mysqlDb.query(sql, [id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    const news = result[0];
    callback(null, news);
  });
};

// 查询--分类
const getNewsCategories = (callback) => {
  const sql = "SELECT * FROM news_categories";
  mysqlDb.query(sql, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// 新增新闻
const insertNews = (
  id,
  title,
  content,
  coverUrl,
  category_id,
  create_time,
  state,
  callback
) => {
  const sql =
    "INSERT INTO news (id, title, content, coverUrl, category_id, create_time, state) VALUES (?,?,?,?,?,?,?)";
  mysqlDb.query(
    sql,
    [id, title, content, coverUrl, category_id, create_time, state],
    (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result.insertId);
    }
  );
};

// 删除新闻
const deleteNews = (id, callback) => {
  const sql = "DELETE FROM news WHERE id = ?";
  mysqlDb.query(sql, [id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result.affectedRows);
  });
};

// 更新新闻
const updateNews = (
  id,
  title,
  content,
  coverUrl,
  category_id,

  state,
  callback
) => {
  const sql =
    "UPDATE news SET title = ?, content = ?, coverUrl = ?, category_id = ?, state = ? WHERE id = ?";
  mysqlDb.query(
    sql,
    [title, content, coverUrl, category_id, state, id],
    (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result.affectedRows);
    }
  );
};

module.exports = {
  getNews,
  getNewsById,
  getNewsCategories,
  insertNews,
  deleteNews,
  updateNews,
};
