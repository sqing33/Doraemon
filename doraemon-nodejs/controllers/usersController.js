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

// 用户信息
const getUserInfo = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, jwtKey.key, (err, decoded) => {
    if (err) {
      return res.send({ state: 2, message: "token 已过期或无效" });
    }
    /* const { username } = decoded;
    usersService.getUserInfo(username, (err, result) => {
      if (err) {
        return res.send({ state: 1, message: err });
      }
      return res.send({ state: 0, message: "查询成功", data: result });
    }); */
    return res.send({ state: 0, message: "token 验证成功" });
  });
};

// 管理员管理用户信息
const getUsers = (req, res, next) => {
  usersService.getUsers((err, usersArr) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: usersArr });
  });
};

module.exports = {
  postCode,
  registUser,
  loginUser,
  getUserInfo,
  getUsers,
};
