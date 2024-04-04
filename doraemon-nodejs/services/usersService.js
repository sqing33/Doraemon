const { mysqlDb } = require("../db");

// 用户注册
const registUser = (user, callback) => {
  const sql =
    "INSERT INTO users (username, password, nickname, email, phone) VALUES (?,?,?,?,?)";
  mysqlDb.query(
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
  mysqlDb.query(
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

const getUserInfo = (username, callback) => {
  const sql =
    "SELECT username, nickname, avatar, createTime, phone, email, gender, birthday FROM users WHERE username = ?";
  mysqlDb.query(sql, [username], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result[0]);
  });
};

// 管理员管理用户信息
const getUsers = (callback) => {
  const sql =
    "SELECT username, nickname, avatar, createTime, phone, email, gender, birthday FROM users";
  mysqlDb.query(sql, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

module.exports = {
  registUser,
  loginUser,
  getUserInfo,
  getUsers,
};
