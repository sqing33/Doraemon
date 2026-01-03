const nodemailer = require("nodemailer");

// 使用你的SMTP信息创建一个传输器对象
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com", // SMTP服务器地址
  port: 465, // SMTP服务器端口
  secure: true, // 是否使用SSL加密
  auth: {
    user: process.env.EMAIL_USER, // 用户名
    pass: process.env.EMAIL_PASS, // 密码
  },
});

// 发送邮件的函数
const sendVerificationCode = (email, code, callback) => {
  const mailOptions = {
    from: `哆啦A梦世界探索 <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "哆啦A梦世界探索",
    text: `欢迎访问哆啦A梦世界探索网站，您的验证码是：${code}，有效期为2分钟。`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error);
    } else {
      callback(null, info.response);
    }
  });
};

// 导出函数
module.exports = {
  sendVerificationCode,
};
