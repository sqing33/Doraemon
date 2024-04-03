const userService = require("../services/usersService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtKey = require("../jwtKey");

// 用户注册
const registUser = (req, res, next) => {
  const { username, password, nickname, email, phone } = req.query._value;

  //const hashedPassword = bcrypt.hashSync(password, 10);

  const user = {
    username,
    password,
    nickname,
    email,
    phone,
  };
  userService.registUser(user, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "新增成功", data: result });
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

  userService.loginUser(user, (err, result) => {
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
      return res.send({ state: 1, message: "token 验证失败" });
    }
  });
  return res.send({ state: 0, message: "token 验证成功" });
};

module.exports = {
  registUser,
  loginUser,
  getUserInfo,
};
