const { mysqlDb } = require("../db");
const SnowFlakeId = require("../utils/SnowFlakeIdGenerator");
const dateFunction = require("../utils/Date");
const LZString = require("lz-string");

// 新增新闻
const insertNews = (news, callback) => {
  const sql =
    "INSERT INTO news (title, content, coverUrl, region, publisher, date, status) VALUES (?,?,?,?,?,?,?)";
  mysqlDb.query(
    sql,
    [
      news.title,
      news.content,
      news.coverUrl,
      news.region,
      news.publisher,
      news.date,
      news.status,
    ],
    (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result.insertId);
    }
  );
};

// 根据id查询新闻详情
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

// 查询新闻列表
const getNewsList = (callback) => {
  const sql = "SELECT * FROM news";
  mysqlDb.query(sql, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// 查询新闻分类
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

// 分页查询新闻列表
const getNewsByPage = (page, pageSize, callback) => {
  const pages = (page - 1) * pageSize;
  const sql = "SELECT * FROM news LIMIT ? OFFSET ?";
  const sql2 = "SELECT COUNT(*) AS total FROM news";
  let newsArr = [];
  let total;

  mysqlDb.query(sql, [parseInt(pageSize), pages], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    newsArr = result;
    mysqlDb.query(sql2, (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      total = result[0].total;
      callback(null, { newsArr, total });
    });
  });
};

// 根据条件查询文章
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
    console.log(whereSqlStr);
  }

  let sql;

  if (pageSize !== null) {
    sql = " SELECT * FROM news " + whereSqlStr + " LIMIT ?,? ";
  } else if (page == 1 && pageSize == null) {
    sql = " SELECT * FROM news ";
  }

  console.log(sql);

  let params = sqlParams.concat([(page - 1) * pageSize, parseInt(pageSize)]);

  let newsArr = [];
  let total;

  mysqlDb.query(sql, params, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log(result);

    if (length === 0) {
      newsArr = result;
    } else if (length) {
      newsArr = result.map((item) => {
        item.content = LZString.decompressFromBase64(item.content);
        item.content = item.content.slice(0, 99) + "...";
        item.content = LZString.compressToBase64(item.content);
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

module.exports = {
  getNewsList,
  getNewsByPage,
  getNewsCategories,
  getNewsById,
  getNews,
  insertNews,
};
