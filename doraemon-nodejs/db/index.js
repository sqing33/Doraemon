const mysql = require("mysql");
const redis = require("redis");

const mysqlDb = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "doraemon",
});

const redisDb = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

module.exports = {
  mysqlDb,
  redisDb,
};
