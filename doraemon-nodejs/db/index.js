const mysql = require("mysql");
const Redis = require("ioredis");

const mysqlDb = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "doraemon",
});

const redisDb = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

module.exports = {
  mysqlDb,
  redisDb,
};
