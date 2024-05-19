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
const getCollectionList = (user_id, callback) => {
  const sql =
    "SELECT b.title, b.coverUrl, ubc.collection_time" +
    " FROM blog b" +
    " JOIN user_blog_collection ubc ON b.id = ubc.blog_id" +
    " WHERE ubc.user_id = ?";
  mysqlDb.query(sql, [user_id], (err, result) => {
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

// 用户反馈
const feedback = (id, content, user_id, create_time, callback) => {
  const sql =
    "INSERT INTO feedback (id,user_id, content, create_time) VALUES (?,?,?,?)";
  mysqlDb.query(sql, [id, user_id, content, create_time], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// 获取用户反馈列表
const getFeedbackList = (user_id, callback) => {
  const sql =
    "SELECT id, user_id, content, create_time FROM feedback WHERE user_id = ?";
  mysqlDb.query(sql, [user_id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// 删除用户反馈
const deleteFeedback = (id, callback) => {
  const sql = "DELETE FROM feedback WHERE id = ?";
  mysqlDb.query(sql, [id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// 管理员管理
const getUsers = (keyword, callback) => {
  console.log(keyword);
  if (!keyword) {
    const sql = "SELECT * FROM users";
    mysqlDb.query(sql, (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  } else {
    const sql =
      "SELECT * FROM users WHERE id=? OR username LIKE ? OR nickname LIKE ? OR phone LIKE ? OR email LIKE ?";
    const keywordPattern = `%${keyword}%`;
    mysqlDb.query(
      sql,
      [keyword, keywordPattern, keywordPattern, keywordPattern, keywordPattern],
      (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, result);
      }
    );
  }
};

// 管理员获取用户反馈列表
const getFeedback = (page, pageSize, callback) => {
  const sql =
    "SELECT feedback.*, users.id, users.username, users.nickname" +
    " FROM feedback" +
    " JOIN users ON feedback.user_id = users.id" +
    " LIMIT ?,?";

  const sql2 = "SELECT COUNT(*) as total FROM feedback";

  let feedbackArr = [];
  let total;

  const offset = (page - 1) * pageSize;

  mysqlDb.query(sql, [offset, pageSize], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    feedbackArr = result;

    mysqlDb.query(sql2, (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      total = result[0].total;

      callback(null, { feedbackArr, total });
    });
  });
};

// 管理员删除用户
const deleteUser = (id, callback) => {
  const sql = "DELETE FROM users WHERE id = ?";
  mysqlDb.query(sql, [id], (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, result);
  });
};

// 获取平台数据
const getPlatformData = (callback) => {
  const sql_usercount = "SELECT COUNT(*) as total FROM users";
  const sql_blogcount = "SELECT COUNT(*) as total FROM blog";
  const sql_feedbackcount = "SELECT COUNT(*) as total FROM feedback";

  let usercount, blogcount, feedbackcount;

  mysqlDb.query(sql_usercount, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
    usercount = result[0].total;

    mysqlDb.query(sql_blogcount, (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      blogcount = result[0].total;

      mysqlDb.query(sql_feedbackcount, (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        feedbackcount = result[0].total;

        callback(null, { usercount, blogcount, feedbackcount });
      });
    });
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
  feedback,
  getFeedbackList,
  deleteFeedback,
  getUsers,
  getFeedback,
  deleteUser,
  getPlatformData,
};
