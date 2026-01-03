const mysql = require("mysql2");
const Redis = require("ioredis");

const mysqlDb = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_DATABASE || "doraemon",
});

// Basic connection diagnostics (avoid printing secrets)
console.log("[db] mysql config", {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  database: process.env.DB_DATABASE || "doraemon",
  hasPassword: !!process.env.DB_PASSWORD,
});

mysqlDb.getConnection((err, connection) => {
  if (err) {
    console.error("[db] mysql connection failed", err);
    return;
  }
  console.log("[db] mysql connection ok");
  connection.release();
});

const redisDb = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "",
});

console.log("[db] redis config", {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  hasPassword: !!process.env.REDIS_PASSWORD,
});

module.exports = {
  mysqlDb,
  redisDb,
};
