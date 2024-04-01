const userService = require("../services/usersService");

/* // 查询新闻列表
const getNewsList = (req, res, next) => {
  newsService.getNewsList((err, newsArr) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: newsArr });
  });
};

// 根据id查询新闻详情
const getNewsById = (req, res, next) => {
  const id = req.query.id;
  newsService.getNewsById(id, (err, news) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "查询成功", data: news });
  });
}; */

// 新增新闻
const registUser = (req, res, next) => {
  const { username, password, nickname, email, phone } = req.query._value;
  const user = {
    username,
    password,
    nickname,
    email,
    phone,
  };
  console.log(user);
  userService.registUser(user, (err, result) => {
    if (err) {
      return res.send({ state: 1, message: err });
    }
    return res.send({ state: 0, message: "新增成功", data: result });
  });
};

module.exports = {
  registUser,
};
