const usersService = require("../services/usersService");
const emailService = require("../services/emailService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtKey = require("../utils/jwtKey");
const { redisDb } = require("../db");
const _ = require("lodash");
const SnowFlakeId = require("../utils/SnowFlakeIdGenerator");
const dateFunction = require("../utils/Date");

// 获取邮箱验证码
const postCode = (req, res, next) => {
  const code = _.random(0, 999999).toString().padStart(6, "0");
  const email = req.query.email;

  emailService.sendVerificationCode(email, code, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }

    redisDb
      .connect()
      .then(() => {
        return redisDb.set(email, code);
      })
      .then(() => {
        return redisDb.expire(email, 120); // 验证码有效期 2 分钟
      })
      .then(() => {
        return res.send({
          state: 0,
          message: "验证码发送成功",
          result: result,
        });
      })
      .catch((error) => {
        console.error("将验证码保存到 Redis 中时发生错误：", error);
        return res.send({ state: 1, message: "验证码发送失败" });
      })
      .finally(() => {
        redisDb.quit();
      });
  });
};

// 用户注册
const registUser = (req, res, next) => {
  const { username, password, nickname, phone, email, code } = req.query._value;

  //const hashedPassword = bcrypt.hashSync(password, 10);

  const snowFlakeId = new SnowFlakeId({ WorkerId: 1 });
  const id = snowFlakeId.NextId();

  const create_time = dateFunction();

  redisDb
    .connect()
    .then(() => {
      // 从 Redis 中获取验证码
      return redisDb.get(email);
    })
    .then((codeFromRedis) => {
      // 验证码过期或错误
      if (!codeFromRedis) {
        return res.send({ state: 2, message: "验证码已过期" });
      } else if (codeFromRedis !== code) {
        return res.send({ state: 1, message: "验证码错误" });
      } else {
        // 注册用户
        usersService.registUser(
          id,
          username,
          password,
          nickname,
          phone,
          email,
          create_time,
          (err, result) => {
            if (err) {
              return res.send({ state: 1, message: err });
            }
            return res.send({ state: 0, message: "新增成功", data: result });
          }
        );
      }
    })
    .catch((error) => {
      console.error("从 Redis 获取验证码时发生错误：", error);
      return res.send({ state: 1, message: "服务器错误" });
    })
    .finally(() => {
      redisDb.quit();
    });
};

// 用户登录
const loginUser = (req, res, next) => {
  const { username, email, phone, password } = req.query._value;

  //const hashedPassword = bcrypt.hashSync(password, 10);

  const user = {
    username,
    email,
    phone,
    password,
  };

  usersService.loginUser(user, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    jwt.sign({ username }, jwtKey.key, (err, token) => {
      if (err) {
        console.error(err);
      } else {
        res.send({ state: 0, message: "登录成功", data: result, token });
      }
    });
  });
};

// 进入用户信息
const goToUserInfo = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, jwtKey.key, (err, decoded) => {
    if (err) {
      return res.send({ state: 2, message: "token 已过期或无效" });
    }
    /* const { username } = decoded;
        usersService.goToUserInfo(username, (err, result) => {
          if (err) {
            return res.send({ state: 1, message: err });
          }
          return res.send({ state: 0, message: "查询成功", data: result });
        }); */
    return res.send({ state: 0, message: "token 验证成功" });
  });
};

// 收藏
const doCollect = (req, res, next) => {
  const { blog_id, user_id } = req.body;

  const create_time = dateFunction();

  usersService.doCollect(blog_id, user_id, create_time, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "收藏成功", data: result });
  });
};

// 获取用户信息
const getUserInfo = (req, res, next) => {
  const { id } = req.body;
  usersService.getUserInfo(id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

// 获取用户博客列表
const getUserBlogList = (req, res, next) => {
  const { id } = req.body;
  usersService.getUserBlogList(id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

// 获取用户收藏列表
const getCollectionList = (req, res, next) => {
  const { user_id } = req.body;
  usersService.getCollectionList(user_id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

// 修改用户头像
const updateAvatar = (req, res, next) => {
  //const token = req.headers.authorization;
  //jwt.verify(token, jwtKey.key, (err, decoded) => {
  //if (err) {
  //   return res.send({ state: 2, message: "token 已过期或无效" });
  // }

  const { id, avatarUrl } = req.body;

  console.log(id, avatarUrl);
  usersService.updateAvatar(id, avatarUrl, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "修改成功", data: result });
    // });
  });
};

// 修改用户信息
const updateUserInfo = (req, res, next) => {
  const { id, username, nickname, avatarUrl, phone, email, gender, birthday } =
    req.body;
  usersService.updateUserInfo(
    id,
    username,
    nickname,
    avatarUrl,
    phone,
    email,
    gender,
    dateFunction(birthday),
    (err, result) => {
      if (err) {
        return res.send({ state: 1, message: err });
      }
      return res.send({ state: 0, message: "修改成功", data: result });
    }
  );
};

// 修改密码、手机号、邮箱
const updateAccount = (req, res, next) => {
  const { id, password, phone, email } = req.body;

  usersService.updateAccount(id, password, phone, email, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "修改成功", data: result });
  });
};

// 用户反馈
const feedback = (req, res, next) => {
  const { content, user_id } = req.body;

  const create_time = dateFunction();

  const snowFlakeId = new SnowFlakeId({ WorkerId: 1 });
  const id = snowFlakeId.NextId();

  usersService.feedback(id, content, user_id, create_time, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "反馈成功", data: result });
  });
};

// 获取用户反馈列表
const getFeedbackList = (req, res, next) => {
  const { user_id } = req.body;
  usersService.getFeedbackList(user_id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

// 删除用户反馈
const deleteFeedback = (req, res, next) => {
  const { id } = req.body;
  usersService.deleteFeedback(id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "删除成功", data: result });
  });
};

// 管理员获取用户列表
const getUsers = (req, res, next) => {
  const { keyword } = req.query;

  usersService.getUsers(keyword, (err, usersArr) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: usersArr });
  });
};

// 管理员获取用户反馈列表
const getFeedback = (req, res, next) => {
  const { page, pageSize } = req.body;
  usersService.getFeedback(page, pageSize, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

// 管理员删除用户
const deleteUser = (req, res, next) => {
  const { id } = req.body;
  usersService.deleteUser(id, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "删除成功", data: result });
  });
};

// 获取平台数据
const getPlatformData = (req, res, next) => {
  usersService.getPlatformData((err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: result });
  });
};

module.exports = {
  postCode,
  registUser,
  loginUser,
  goToUserInfo,
  doCollect,
  getUserInfo,
  getUserBlogList,
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
