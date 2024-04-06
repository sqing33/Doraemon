const date = () => {
  const now = new Date();

  // 获取年、月、日、时、分、秒
  const year = now.getFullYear(); // 年份
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份，月份从0开始，所以需要+1
  const date = now.getDate().toString().padStart(2, "0"); // 日期
  const hours = now.getHours().toString().padStart(2, "0"); // 小时
  const minutes = now.getMinutes().toString().padStart(2, "0"); // 分钟
  const seconds = now.getSeconds().toString().padStart(2, "0"); // 秒

  // 格式化输出，例如：2024-04-06 12:30:45
  const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
};

module.exports = date;
