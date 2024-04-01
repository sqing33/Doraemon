const db = require("../db");

/* // 查询新闻列表
const getNewsList = (callback) => {
  const sql = "SELECT * FROM news";
  db.query(sql, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    const newsArr = result.map((news) => ({
      id: news.id,
      title: news.title,
      content: news.content,
      coverUrl: news.coverUrl,
      region: news.region,
      publisher: news.publisher,
      date: news.date,
      status: news.status,
    }));
    callback(null, newsArr);
  });
};

// 根据id查询新闻详情
const getNewsById = (id, callback) => {
  const sql = "SELECT * FROM news WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    const news = result[0];
    news.content = Buffer.from(news.content).toString("utf-8");
    callback(null, news);
  });
}; */

const registUser = (user, callback) => {
  const sql =
    "INSERT INTO users (username, password, nickname, email, phone) VALUES (?,?,?,?,?)";
  db.query(
    sql,
    [user.username, user.password, user.nickname, user.email, user.phone],
    (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result.insertId);
    }
  );
};

module.exports = {
  registUser,
};
