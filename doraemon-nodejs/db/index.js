const mysql = require("mysql");
const Redis = require("ioredis");

const mysqlDb = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_DATABASE || "doraemon",
});

const redisDb = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "",
});

module.exports = {
  mysqlDb,
  redisDb,
};
