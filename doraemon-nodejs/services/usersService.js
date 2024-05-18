const { mysqlDb } = require("../db");

// 用户注册
const registUser = (
  id,
  username,
  password,
  nickname,
  phone,
  email,
  create_time,
  callback
) => {
  const sql =
    "INSERT INTO users (id, username, password, nickname, phone, email, create_time) VALUES (?,?,?,?,?,?,?)";
  mysqlDb.query(
    sql,
    [id, username, password, nickname, phone, email, create_time],
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
    "SELECT id, username, nickname, avatarUrl, create_time, phone, email, gender, birthday FROM users WHERE username = ? OR phone = ? OR email = ? AND password = ?";
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

// 进入用户信息
const goToUserInfo = (username, callback) => {
  const sql =
    "SELECT username, nickname, avatarUrl, create_time, phone, email, gender, birthday FROM users WHERE username = ?";
  mysqlDb.query(sql, [username], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result[0]);
  });
};

const doCollect = (blog_id, user_id, create_time, callback) => {
  const sql =
    "INSERT INTO user_blog_collection (blog_id, user_id, collection_time) VALUES (?,?,?)";
  mysqlDb.query(sql, [blog_id, user_id, create_time], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// 获取用户信息
const getUserInfo = (id, callback) => {
  const sql =
    "SELECT id, username, nickname, avatarUrl, create_time, phone, email, gender, birthday FROM users WHERE id = ?";
  mysqlDb.query(sql, [id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result[0]);
  });
};

// 获取用户博客列表
const getUserBlogList = (id, callback) => {
  const sql =
    "SELECT b.*" +
    " FROM blog b" +
    " JOIN user_blog ba ON b.id = ba.blog_id" +
    " WHERE ba.user_id = ?";
  mysqlDb.query(sql, [id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// 获取用户收藏列表
const getCollectionList = (id, callback) => {
  const sql =
    "SELECT b.title, b.coverUrl, ubc.collection_time" +
    " FROM blog b" +
    " JOIN user_blog_collection ubc ON b.id = ubc.blog_id" +
    " WHERE ubc.user_id = ?";
  mysqlDb.query(sql, [id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// 修改用户头像
const updateAvatar = (id, avatarUrl, callback) => {
  const sql = "UPDATE users SET avatarUrl = ? WHERE id = ?";
  mysqlDb.query(sql, [avatarUrl, id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// 修改用户信息
const updateUserInfo = (
  id,
  username,
  nickname,
  avatarUrl,
  phone,
  email,
  gender,
  birthday,
  callback
) => {
  const sql =
    "UPDATE users SET username = ?, nickname = ?, avatarUrl = ?, phone = ?, email = ?, gender = ?, birthday = ? WHERE id = ?";
  mysqlDb.query(
    sql,
    [username, nickname, avatarUrl, phone, email, gender, birthday, id],
    (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    }
  );
};

// 修改密码、手机号、邮箱
const updateAccount = (id, password, phone, email, callback) => {
  console.log(id, password, phone, email);

  const sql = "UPDATE users SET phone = ?, email = ? WHERE id = ?";
  const sql2 =
    "UPDATE users SET password = ?, phone = ?, email = ? WHERE id = ?";

  if (password === "") {
    mysqlDb.query(sql, [phone, email, id], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  } else {
    mysqlDb.query(sql2, [password, phone, email, id], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }
};

// 管理员管理
const getUsers = (callback) => {
  const sql =
    "SELECT  username, nickname, avatarUrl, create_time, phone, email, gender, birthday FROM users";
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
  goToUserInfo,
  getUserInfo,
  getUserBlogList,
  doCollect,
  getCollectionList,
  updateAvatar,
  updateUserInfo,
  updateAccount,
  getUsers,
};
