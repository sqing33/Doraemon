const db = require("../db");

// 用户注册
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

// 用户登录
const loginUser = (user, callback) => {
  const sql =
    "SELECT username, nickname, email, phone FROM users WHERE username = ? OR phone = ? OR email = ? AND password = ?";
  db.query(
    sql,
    [user.username, user.phone, user.email, user.password],
    (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      if (result.length === 0) {
        callback("用户名或密码错误", null);
        return;
      }
      callback(null, result[0]);
    }
  );
};

const getUserInfo = (userId, callback) => {
  /* const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (result.length === 0) {
      callback("用户不存在", null);
      return;
    }
    callback(null, result[0]);
  }); */
};

module.exports = {
  registUser,
  loginUser,
  getUserInfo,
};
